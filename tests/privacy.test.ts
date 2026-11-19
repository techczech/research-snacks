import { test, expect } from 'bun:test';
import { privacyErrors } from '../src/lib/content';

test('public HTTP URL paths are allowed in prose, link targets and data', () => {
  const url = 'https://www.parliament.lk/en/home/business-of-the-house/view/2655';
  for (const value of [url, `[Parliament](${url})`, `<${url}>`, `source_url: ${url}`,
    JSON.stringify({ url }), `case,source\nSri Lanka,${url}`,
    'http://example.org/Users/manual', 'https://example.org/~/guide']) {
    expect(privacyErrors(value, 'fixture')).toEqual([]);
  }
});

test('public URLs do not hide adjacent real paths or other privacy violations', () => {
  const url = 'https://example.org/home/public';
  for (const path of ['/Users/example/private', '~/private', '/home/person/private', 'C:\\private',
    '[private](/home/person/private)', '[private](/Users/example/private)']) {
    expect(privacyErrors(`${url} ${path}`, 'fixture').some(error => error.includes('path'))).toBe(true);
  }
  for (const value of ['https://example.local/home/public', 'https://example.org/home/private@example.org',
    `${url} javascript:example`, `${url} data:text/html`]) {
    expect(privacyErrors(value, 'fixture').length).toBeGreaterThan(0);
  }
  expect(privacyErrors(`safe\n${url} /home/person/private`, 'fixture')[0]).toContain('fixture:2:');
});
