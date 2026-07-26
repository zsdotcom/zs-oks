import { KNOWLEDGE_SOURCES, KnowledgeFetchResult, KnowledgeResultItem } from '../types';

const cache = new Map<string, { data: KnowledgeResultItem[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function queryKnowledgeSource(
  sourceName: string,
  query: string
): Promise<KnowledgeFetchResult> {
  const source = KNOWLEDGE_SOURCES.find((s) => s.name === sourceName);
  if (!source) throw new Error(`Unknown knowledge source: ${sourceName}`);

  const cacheKey = `${sourceName}:${query.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { source: sourceName, query, results: cached.data, timestamp: new Date(), cached: true };
  }

  let results: KnowledgeResultItem[] = [];
  try {
    switch (sourceName) {
      case 'wikipedia':
        results = await fetchWikipediaResults(query);
        break;
      case 'arxiv':
        results = await fetchArxivResults(query);
        break;
      case 'openalex':
        results = await fetchOpenAlexResults(query);
        break;
      case 'pubmed':
        results = await fetchPubMedResults(query);
        break;
      case 'semantic-scholar':
        results = await fetchSemanticScholarResults(query);
        break;
      case 'who-gho':
        results = await fetchWHOResults(query);
        break;
      case 'gdelt':
        results = await fetchGDELTResults(query);
        break;
      case 'crossref':
        results = await fetchCrossRefResults(query);
        break;
      default:
        results = [];
    }
  } catch {
    results = [{ title: `Source: ${sourceName}`, url: '', snippet: 'Error fetching from source. Check connectivity.', source: sourceName, confidence: 'low' }];
  }

  cache.set(cacheKey, { data: results, timestamp: Date.now() });
  return { source: sourceName, query, results, timestamp: new Date(), cached: false };
}

export async function queryAllSources(query: string): Promise<KnowledgeFetchResult[]> {
  const sources = KNOWLEDGE_SOURCES.filter((s) => s.enabled && s.name !== 'rss');
  const results = await Promise.allSettled(sources.map((s) => queryKnowledgeSource(s.name, query)));
  return results
    .filter((r): r is PromiseFulfilledResult<KnowledgeFetchResult> => r.status === 'fulfilled')
    .map((r) => r.value);
}

export function clearKnowledgeCache(): void {
  cache.clear();
}

async function fetchWikipediaResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://en.wikipedia.org/api/rest_v1/search/page?q=${encodeURIComponent(query)}&limit=5`);
  const data = await res.json();
  return (data.pages || []).map((p: any) => ({
    title: p.title, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
    snippet: p.extract?.slice(0, 300) || '', source: 'Wikipedia', confidence: 'high' as const,
  }));
}

async function fetchArxivResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=5`);
  const text = await res.text();
  const xml = new DOMParser().parseFromString(text, 'text/xml');
  return Array.from(xml.querySelectorAll('entry')).slice(0, 5).map((e) => ({
    title: e.querySelector('title')?.textContent?.trim() || '', url: e.querySelector('id')?.textContent || '',
    snippet: e.querySelector('summary')?.textContent?.trim().slice(0, 300) || '',
    source: 'arXiv', date: e.querySelector('published')?.textContent?.slice(0, 10) || '',
    authors: Array.from(e.querySelectorAll('author name')).map((a) => a.textContent || ''), confidence: 'high' as const,
  }));
}

async function fetchOpenAlexResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=5`);
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    title: r.title || '', url: r.id || '',
    snippet: r.abstract_inverted_index ? Object.keys(r.abstract_inverted_index).slice(0, 50).join(' ') : '',
    source: 'OpenAlex', date: r.publication_date || '',
    authors: r.authorships?.map((a: any) => a.author.display_name) || [], doi: r.doi, confidence: 'medium' as const,
  }));
}

async function fetchPubMedResults(query: string): Promise<KnowledgeResultItem[]> {
  const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`);
  const searchData = await searchRes.json();
  const ids = searchData.esearchresult?.idlist || [];
  if (ids.length === 0) return [];
  const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
  const fetchData = await fetchRes.json();
  return ids.map((id: string) => {
    const r = fetchData.result?.[id];
    return { title: r?.title || '', url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`, snippet: r?.source || '', source: 'PubMed', authors: r?.authors?.map((a: any) => a.name) || [], date: r?.pubdate || '', doi: r?.elocationid || '', confidence: 'high' as const };
  });
}

async function fetchSemanticScholarResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=5&fields=title,url,abstract,authors,year`);
  const data = await res.json();
  return (data.data || []).map((p: any) => ({
    title: p.title || '', url: p.url || '', snippet: p.abstract?.slice(0, 300) || '',
    source: 'Semantic Scholar', date: p.year?.toString() || '',
    authors: p.authors?.map((a: any) => a.name) || [], confidence: 'medium' as const,
  }));
}

async function fetchWHOResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://ghoapi.azureedge.net/api/Indicator`);
  const data = await res.json();
  const matching = (data.value || []).filter((i: any) =>
    i.IndicatorName?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);
  return matching.map((i: any) => ({
    title: i.IndicatorName || '', url: `https://www.who.int/data/gho/data/indicators/indicator-details/GHO/${i.IndicatorCode}`,
    snippet: `WHO Indicator: ${i.IndicatorCode}`, source: 'WHO GHO', confidence: 'high' as const,
  }));
}

async function fetchGDELTResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&format=json&maxrecords=5`);
  const data = await res.json();
  return (data.articles || []).map((a: any) => ({
    title: a.title || '', url: a.url || '', snippet: a.seeding || '', source: 'GDELT', date: a.date || '', confidence: 'medium' as const,
  }));
}

async function fetchCrossRefResults(query: string): Promise<KnowledgeResultItem[]> {
  const res = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=5`);
  const data = await res.json();
  return (data.message?.items || []).map((item: any) => ({
    title: item.title?.[0] || '', url: item.URL || '', snippet: item.abstract || item.subtitle?.[0] || '',
    source: 'CrossRef', date: item.created?.date?.slice(0, 10) || '',
    authors: item.author?.map((a: any) => `${a.given} ${a.family}`) || [], doi: item.DOI,
    confidence: 'medium' as const,
  }));
}
