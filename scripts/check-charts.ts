import type { Browser } from 'playwright-core';

// SVG scaffolding and export controls can exist even when Vega failed to load data.
// Inspect the rendered data marks, excluding axes, legends and plot backgrounds.
export async function inspectEntryCharts(browser: Browser, base: string, paths: string[]) {
  const results = [];
  const context = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' });
  try {
    for (const width of [1280, 390]) {
      for (const path of paths) {
        const page = await context.newPage();
        await page.setViewportSize({ width, height: 900 });
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => {
          if (message.type() === 'error' ||
              (message.type() === 'warning' && /\b(error|failed|invalid|infinite extent)\b/i.test(message.text()))) {
            errors.push(message.text());
          }
        });
        try {
          const response = await page.goto(base + path);
          if (response?.status() !== 200) errors.push(`Page returned HTTP ${response?.status()}`);
          const count = await page.locator('figure.ichart').count();
          if (count) {
            try {
              await page.waitForFunction(n => document.querySelectorAll('figure.ichart.live').length === n,
                count, { timeout: 30000 });
            } catch {
              errors.push('Not every embedded chart completed Vega enhancement within 30 seconds');
            }
          }
          const charts = await page.locator('figure.ichart').evaluateAll(figures => figures.map(figure => {
            const svg = figure.querySelector('svg.marks');
            const marks = svg ? Array.from(svg.querySelectorAll('.role-mark > path, .role-mark > rect, .role-mark > circle, .role-mark > line, .role-mark > polygon, .role-mark > text, .role-mark > image')) : [];
            const dataMarks = marks.filter(mark => {
              const box = (mark as SVGGraphicsElement).getBBox();
              const style = getComputedStyle(mark);
              const geometry = mark.getAttribute('d') ?? '';
              return (box.width > 0 || box.height > 0) &&
                style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 &&
                !/NaN|Infinity/.test(geometry) &&
                (mark.tagName !== 'path' || geometry.length > 0);
            }).length;
            return {
              spec: figure.querySelector<HTMLElement>('[data-spec]')?.dataset.spec,
              live: figure.classList.contains('live'),
              svg: !!svg,
              exports: !!figure.querySelector('.vega-actions'),
              dataMarks,
              // Inspect all SVG labels: this includes both facet headers and axis text.
              undefinedLabels: svg ? Array.from(svg.querySelectorAll('text')).filter(text => text.textContent?.trim() === 'undefined').length : 0,
            };
          }));
          for (const chart of charts) {
            if (!chart.live || !chart.svg || !chart.exports) errors.push(`${chart.spec}: missing rendered SVG or export controls`);
            if (!chart.dataMarks) errors.push(`${chart.spec}: no visible data marks`);
            if (chart.undefinedLabels) errors.push(`${chart.spec}: ${chart.undefinedLabels} undefined labels`);
          }
          results.push({ path, width, charts, errors });
        } catch (error) {
          results.push({ path, width, charts: [], errors: [...errors, String(error)] });
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await context.close();
  }
  return results;
}
