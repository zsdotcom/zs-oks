import { ToolDefinition, ToolPermission, BUILT_IN_TOOLS } from '../types';
import { storeSession, storeEpisodic, storeSemantic, searchSemantic, deleteSemantic, storeProcedural, storeWorking, storeLongTerm, computeEmbedding } from './memoryApi';
import { searchAll, buildSearchIndex } from './searchService';

export function getAvailableTools(agentTools?: string[]): ToolDefinition[] {
  if (!agentTools || agentTools.length === 0) return BUILT_IN_TOOLS;
  return BUILT_IN_TOOLS.filter((t) => agentTools.includes(t.id));
}

export function getToolsByPermission(permission: ToolPermission): ToolDefinition[] {
  const levels: ToolPermission[] = ['safe', 'standard', 'elevated', 'admin'];
  const maxLevel = levels.indexOf(permission);
  return BUILT_IN_TOOLS.filter((t) => levels.indexOf(t.permission) <= maxLevel);
}

export function getToolById(id: string): ToolDefinition | undefined {
  return BUILT_IN_TOOLS.find((t) => t.id === id);
}

export async function executeTool(
  toolId: string,
  params: Record<string, any>,
  context: { agentId: string; projectId: string }
): Promise<{ success: boolean; result: any; error?: string }> {
  const tool = getToolById(toolId);
  if (!tool) return { success: false, result: null, error: `Tool '${toolId}' not found` };

  const agentCall = {
    agentId: context.agentId,
    toolName: toolId,
    params,
    timestamp: new Date().toISOString(),
  };

  await storeWorking({
    id: `tool-${Date.now()}`,
    projectId: context.projectId,
    agentId: context.agentId,
    sessionId: 'tool-exec',
    key: `tool-call-${toolId}`,
    value: agentCall,
    createdAt: new Date().toISOString(),
  });

  try {
    let result: any;
    switch (toolId) {
      case 'calculate':
        result = safeEvaluate(params.expression);
        break;
      case 'search-web':
        result = await fetchWebSearch(params.query);
        break;
      case 'search-wikipedia':
        result = await fetchWikipedia(params.query);
        break;
      case 'search-arxiv':
        result = await fetchArxiv(params.query);
        break;
      case 'search-openalex':
        result = await fetchOpenAlex(params.query);
        break;
      case 'search-pubmed':
        result = await fetchPubMed(params.query);
        break;
      case 'search-who':
        result = await fetchWHO(params.indicator);
        break;
      case 'vectorize':
        result = await computeEmbedding(params.text);
        break;
      case 'translate':
        result = await translateText(params.text, params.targetLang);
        break;
      case 'remember':
        result = await handleRemember(params, context);
        break;
      case 'recall':
        result = await handleRecall(params);
        break;
      case 'forget':
        result = await handleForget(params);
        break;
      case 'semantic-search':
        result = await searchSemantic(params.query || '', params.topK || 5);
        break;
      case 'list-agents':
        result = { message: 'Active agents can be listed via the Agent Builder panel' };
        break;
      default:
        return { success: false, result: null, error: `Tool '${toolId}' not implemented as executable` };
    }
    return { success: true, result };
  } catch (err: any) {
    return { success: false, result: null, error: err.message };
  }
}

async function handleRemember(params: Record<string, any>, context: { agentId: string; projectId: string }): Promise<any> {
  const { key, value, tier } = params;
  const tierVal = tier || 'session';
  const id = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();

  switch (tierVal) {
    case 'session':
      storeSession(key, value);
      return { stored: true, tier: 'session', key };
    case 'episodic':
      await storeEpisodic({ id, projectId: context.projectId, agentId: context.agentId, text: value, summary: null, createdAt: now });
      return { stored: true, tier: 'episodic', id };
    case 'semantic':
      await storeSemantic({ id, projectId: context.projectId, agentId: context.agentId, topic: key, text: value, embedding: [], createdAt: now });
      return { stored: true, tier: 'semantic', id };
    case 'procedural':
      await storeProcedural({ id, projectId: context.projectId, skillId: key, instructions: value, triggers: [], createdAt: now });
      return { stored: true, tier: 'procedural', id };
    case 'working':
      await storeWorking({ id, projectId: context.projectId, agentId: context.agentId, sessionId: key, key, value, createdAt: now });
      return { stored: true, tier: 'working', id };
    case 'long_term':
      await storeLongTerm({ id, projectId: context.projectId, category: key, text: value, references: [], createdAt: now });
      return { stored: true, tier: 'long_term', id };
    default:
      storeSession(key, value);
      return { stored: true, tier: 'session', key };
  }
}

async function handleRecall(params: Record<string, any>): Promise<any> {
  const { query, tier, topK } = params;
  const k = topK || 5;

  if (tier === 'semantic' || !tier) {
    const results = await searchSemantic(query || '', k);
    if (results.length > 0) return results;
  }
  await buildSearchIndex();
  const results = searchAll(query || '');
  return results.slice(0, k);
}

async function handleForget(params: Record<string, any>): Promise<any> {
  const { key, tier } = params;
  if (tier === 'semantic') {
    await deleteSemantic(key);
    return { removed: true, tier: 'semantic', key };
  }
  return { removed: false, message: 'Forget is primarily supported for semantic memory. Use the IndexedDB store directly for other tiers.' };
}

function safeEvaluate(expr: string): number {
  const sanitized = expr.replace(/[^0-9+\-*/.()%\s]/g, '');
  try {
    return Function(`"use strict"; return (${sanitized})`)();
  } catch {
    throw new Error(`Invalid expression: ${expr}`);
  }
}

async function fetchWebSearch(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`);
    const data = await res.json();
    return data.RelatedTopics?.slice(0, 5).map((r: any) => ({
      title: r.Text?.split(' - ')[0] || r.Text,
      snippet: r.Text,
      url: r.FirstURL,
    })) || [];
  } catch {
    return [{ title: `Search results for: ${query}`, snippet: 'Web search unavailable offline.', url: '' }];
  }
}

async function fetchWikipedia(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/search/page?q=${encodeURIComponent(query)}&limit=5`);
    const data = await res.json();
    return data.pages?.map((p: any) => ({
      title: p.title,
      snippet: p.extract?.slice(0, 300) || '',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
    })) || [];
  } catch {
    return [];
  }
}

async function fetchArxiv(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=5`);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml');
    const entries = xml.querySelectorAll('entry');
    return Array.from(entries).slice(0, 5).map((e) => ({
      title: e.querySelector('title')?.textContent?.trim() || '',
      snippet: e.querySelector('summary')?.textContent?.trim().slice(0, 300) || '',
      url: e.querySelector('id')?.textContent || '',
      authors: Array.from(e.querySelectorAll('author name')).map((a) => a.textContent || ''),
      date: e.querySelector('published')?.textContent?.slice(0, 10) || '',
    }));
  } catch {
    return [];
  }
}

async function fetchOpenAlex(query: string): Promise<any[]> {
  try {
    const res = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=5`);
    const data = await res.json();
    return data.results?.map((r: any) => ({
      title: r.title,
      snippet: r.abstract_inverted_index ? Object.keys(r.abstract_inverted_index).slice(0, 50).join(' ') : '',
      url: r.id,
      authors: r.authorships?.map((a: any) => a.author.display_name) || [],
      date: r.publication_date,
      doi: r.doi,
    })) || [];
  } catch {
    return [];
  }
}

async function fetchPubMed(query: string): Promise<any[]> {
  try {
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`);
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist || [];
    if (ids.length === 0) return [];
    const fetchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`);
    const fetchData = await fetchRes.json();
    return ids.map((id: string) => {
      const r = fetchData.result?.[id];
      return { title: r?.title || '', snippet: r?.source || '', url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`, authors: r?.authors?.map((a: any) => a.name) || [], date: r?.pubdate || '' };
    });
  } catch {
    return [];
  }
}

async function fetchWHO(indicator: string): Promise<any> {
  try {
    const res = await fetch(`https://ghoapi.azureedge.net/api/${indicator}`);
    const data = await res.json();
    return data.value?.slice(0, 10) || [];
  } catch {
    return { error: 'WHO API unavailable', indicator };
  }
}

async function translateText(text: string, targetLang: string): Promise<string> {
  if (typeof navigator !== 'undefined' && 'language' in navigator) {
    try {
      const translator = (navigator as any).translator;
      if (translator?.translate) {
        return await translator.translate(text, targetLang);
      }
    } catch {}
  }
  return text;
}
