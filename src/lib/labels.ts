// Reviewed display labels. Slugs and source frontmatter remain unchanged.
const tagLabels:Record<string,string>={
  'Political change':'Political change', 'Internet':'Internet',
  'Civil resistance':'Civil resistance', 'Checking my old writing':'Checking my old writing',
  'linguistics':'Linguistics', 'metaphor':'Metaphor', 'metaphor-use':'Metaphor use',
  'annotation':'Annotation', 'AI-assisted-research':'AI assisted research',
  'corpus-linguistics':'Corpus linguistics', 'English-usage':'English usage',
  'literally':'Literally', 'retrospective':'Retrospective', 'politics':'Politics',
  'monetary-policy':'Monetary policy', 'decipherment':'Decipherment',
  'AI agents':'AI agents', 'ancient languages':'Ancient languages',
  'Ars Inquirendi':'Ars Inquirendi', 'research methods':'Research methods', 'sickly':'Sickly',
};
export const tagLabel=(tag:string)=>tagLabels[tag] || tag.replaceAll('-',' ');
