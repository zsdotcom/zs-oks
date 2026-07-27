import { MCPServer, MCPTool } from '../types';

interface ToolResult {
  toolName: string;
  success: boolean;
  data: any;
  error?: string;
}

const KNOWN_ENDPOINTS: Record<string, { url: string; method: string; buildQuery: (params: Record<string, string>) => URLSearchParams | string }> = {
  get_nndss_surveillance: {
    url: 'https://data.cdc.gov/resource/hc4f-j6nb.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ disease: p.disease || '', ...(p.year ? { year: p.year } : {}), ...(p.state ? { state: p.state } : {}), '$limit': '100' }),
  },
  get_places_data: {
    url: 'https://data.cdc.gov/resource/cwsq-ngmh.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ measure: p.measure || '', ...(p.year ? { year: p.year } : {}), ...(p.state ? { statedesc: p.state } : {}), '$limit': '100' }),
  },
  search_dataset: {
    url: 'https://data.cdc.gov/resource/',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ '$q': p.query || '', '$limit': p.limit || '50' }),
  },
  get_gho_indicator: {
    url: 'https://ghoapi.azureedge.net/api/Indicator',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ '$filter': `IndicatorCode eq '${p.indicator || ''}'` }),
  },
  search_indicators: {
    url: 'https://ghoapi.azureedge.net/api/Indicator',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ '$filter': `contains(IndicatorName,'${(p.query || '').replace(/'/g, "''")}')`, '$top': '20' }),
  },
  get_dimension_values: {
    url: 'https://ghoapi.azureedge.net/api/Dimensions/COUNTRY/DimensionValues',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  get_fluview: {
    url: 'https://delphi.cmu.edu/epidata/api.php',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ source: 'fluview', regions: p.regions || 'nat', epiweeks: p.epiweeks || '202401' }),
  },
  get_covidcast: {
    url: 'https://delphi.cmu.edu/epidata/api.php',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ source: 'covidcast', signal: p.signal || 'confirmed_incidence_num', geo_type: p.geo_type || 'nation', geo_values: p.geo_values || 'us' }),
  },
  get_dengue_nowcast: {
    url: 'https://delphi.cmu.edu/epidata/api.php',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ source: 'dengue_nowcast', epiweeks: p.epiweeks || '202401', locations: 'pr' }),
  },
  list_pathogens: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/pathogens.json',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  get_pathogen_data: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/pathogens.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ pathogen: p.pathogen || '' }),
  },
  get_outbreak_alerts: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/outbreaks.json',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  web_search: {
    url: 'https://api.search.brave.com/res/v1/web/search',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || '', count: p.count || '10' }),
  },
  local_search: {
    url: 'https://api.search.brave.com/res/v1/web/local/search',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || '', country: p.country || 'US' }),
  },
  read_file: {
    url: 'https://api.example.com/filesystem/read',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ path: p.path || '' }),
  },
  list_directory: {
    url: 'https://api.example.com/filesystem/list',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ path: p.path || '/' }),
  },
  write_file: {
    url: 'https://api.example.com/filesystem/write',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams({ path: p.path || '', content: p.content || '' }),
  },
  fetch_url: {
    url: 'https://api.example.com/fetch',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ url: p.url || '' }),
  },
  fetch_json: {
    url: 'https://api.example.com/fetch/json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ url: p.url || '' }),
  },
  slack_send_message: {
    url: 'https://api.example.com/slack/send',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams({ channel: p.channel || '', text: p.text || '' }),
  },
  slack_list_channels: {
    url: 'https://api.example.com/slack/channels',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  playwright_screenshot: {
    url: 'https://api.example.com/playwright/screenshot',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams({ url: p.url || '', selector: p.selector || '' }),
  },
  playwright_evaluate: {
    url: 'https://api.example.com/playwright/evaluate',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams({ url: p.url || '', script: p.script || '' }),
  },
  search_hdx_datasets: {
    url: 'https://data.humdata.org/api/3/action/package_search',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || 'health', rows: p.limit || '20', start: p.offset || '0' }),
  },
  get_hdx_dataset: {
    url: 'https://data.humdata.org/api/3/action/package_show',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ id: p.id || '' }),
  },
  get_hdx_resource: {
    url: 'https://data.humdata.org/api/3/action/resource_show',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ id: p.id || '' }),
  },
  /* ─── GitHub API Endpoints ─── */
  github_user_repos: {
    url: 'https://api.github.com/user/repos',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ per_page: p.perPage || '30', sort: p.sort || 'updated', ...(p.type ? { type: p.type } : {}) }),
  },
  github_search_code: {
    url: 'https://api.github.com/search/code',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || '', per_page: p.perPage || '30' }),
  },
  github_search_issues: {
    url: 'https://api.github.com/search/issues',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || '', per_page: p.perPage || '30' }),
  },
  github_get_readme: {
    url: 'https://api.github.com/repos/{owner}/{repo}/readme',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ ...(p.owner && p.repo ? {} : {}) }),
  },
  github_list_commits: {
    url: 'https://api.github.com/repos/{owner}/{repo}/commits',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ per_page: p.perPage || '10', ...(p.branch ? { sha: p.branch } : {}) }),
  },
  github_list_pulls: {
    url: 'https://api.github.com/repos/{owner}/{repo}/pulls',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ state: p.state || 'open', per_page: p.perPage || '10' }),
  },
  github_release_notes: {
    url: 'https://api.github.com/repos/{owner}/{repo}/releases/latest',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  /* ─── World Bank API Endpoints ─── */
  world_bank_indicator: {
    url: 'https://api.worldbank.org/v2/country/{country}/indicator/{indicator}',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ format: 'json', ...(p.date ? { date: p.date } : {}), per_page: p.perPage || '50' }),
  },
  world_bank_countries: {
    url: 'https://api.worldbank.org/v2/country',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ format: 'json', per_page: p.perPage || '100', region: p.region || '' }),
  },
  world_bank_indicators_list: {
    url: 'https://api.worldbank.org/v2/indicator',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ format: 'json', per_page: p.perPage || '100' }),
  },
  /* ─── Open Library API Endpoints ─── */
  open_library_search: {
    url: 'https://openlibrary.org/search.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || 'subject:epidemiology', limit: p.limit || '20', ...(p.page ? { page: p.page } : {}) }),
  },
  open_library_work: {
    url: 'https://openlibrary.org/works/{workId}.json',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  open_library_subjects: {
    url: 'https://openlibrary.org/subjects/{subject}.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ limit: p.limit || '20', ...(p.detail ? { details: p.detail } : {}) }),
  },
  /* ─── News & Media Endpoints ─── */
  newsapi_top_headlines: {
    url: 'https://newsapi.org/v2/top-headlines',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ country: p.country || 'us', category: p.category || 'health', pageSize: p.pageSize || '10', ...(p.apiKey ? { apiKey: p.apiKey } : {}) }),
  },
  newsapi_everything: {
    url: 'https://newsapi.org/v2/everything',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || 'health', sortBy: p.sortBy || 'publishedAt', pageSize: p.pageSize || '10', ...(p.apiKey ? { apiKey: p.apiKey } : {}) }),
  },
  /* ─── Google Books API Endpoints ─── */
  google_books_search: {
    url: 'https://www.googleapis.com/books/v1/volumes',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ q: p.query || 'public health', maxResults: p.maxResults || '20', ...(p.lang ? { langRestrict: p.lang } : {}) }),
  },
  google_books_volume: {
    url: 'https://www.googleapis.com/books/v1/volumes/{volumeId}',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  /* ─── Europe PMC Endpoints ─── */
  europe_pmc_search: {
    url: 'https://www.ebi.ac.uk/europepmc/api/search',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ query: p.query || 'infectious disease', pageSize: p.pageSize || '20', resultType: 'core', ...(p.sort ? { sort: p.sort } : {}) }),
  },
  /* ─── CrossRef API Endpoints ─── */
  crossref_works: {
    url: 'https://api.crossref.org/works',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ query: p.query || '', rows: p.rows || '20', sort: p.sort || 'relevance', order: p.order || 'desc' }),
  },
  crossref_funders: {
    url: 'https://api.crossref.org/funders',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ query: p.query || '', rows: p.rows || '20' }),
  },
  /* ─── Discord Webhook Endpoint ─── */
  discord_send_message: {
    url: 'https://discord.com/api/webhooks/{webhookId}/{webhookToken}',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams(),
  },
  /* ─── Telegram Bot API Endpoints ─── */
  telegram_send_message: {
    url: 'https://api.telegram.org/bot{token}/sendMessage',
    method: 'POST',
    buildQuery: (p) => new URLSearchParams(),
  },
  /* ─── Ejentum MCP — Reasoning & Code Analysis ─── */
  ejentum_reason: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/reasoning.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ problem: p.problem || '', context: p.context || '', framework: p.framework || 'chain-of-thought' }),
  },
  ejentum_analyze_code: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/code-analysis.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ code: p.code || '', analysis_type: p.analysis_type || 'security', language: p.language || 'auto' }),
  },
  ejentum_anti_deception: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/anti-deception.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ statement: p.statement || '', confidence: p.confidence || 'medium' }),
  },
  ejentum_memory: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/ejentum-memory.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ action: p.action || 'store', key: p.key || '', value: p.value || '' }),
  },
  /* ─── ReliefWeb API ─── */
  reliefweb_search_reports: {
    url: 'https://api.reliefweb.int/v1/reports',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ 'filter[field]': 'country', 'filter[value]': p.country || '', 'query[value]': p.query || '', limit: p.limit || '20', offset: p.offset || '0', sort: p.sort || 'date:desc', profile: 'full' }),
  },
  reliefweb_get_report: {
    url: 'https://api.reliefweb.int/v1/reports',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ 'filter[field]': 'id', 'filter[value]': p.id || '', profile: 'full' }),
  },
  reliefweb_list_disasters: {
    url: 'https://api.reliefweb.int/v1/disasters',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ limit: p.limit || '20', sort: p.sort || 'date:desc', profile: 'full' }),
  },
  /* ─── WHO data.who.int OData API ─── */
  who_data_indicator: {
    url: 'https://data.who.int/api/gho-data/v1/GHO',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ '$filter': `IndicatorCode eq '${p.indicator || ''}'`, '$top': p.limit || '50', ...(p.country ? { '$filter': `SpatialDimension eq '${p.country}'` } : {}) }),
  },
  who_data_search: {
    url: 'https://data.who.int/api/gho-data/v1/GHO',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ '$search': p.query || '', '$top': p.limit || '20' }),
  },
  /* ─── Feedbagel RSS MCP ─── */
  feedbagel_list_feeds: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/rss-feeds.json',
    method: 'GET',
    buildQuery: () => new URLSearchParams(),
  },
  feedbagel_fetch_entries: {
    url: 'https://raw.githubusercontent.com/opencode-ai/open-knowledge-studio/main/docs/data/rss-entries.json',
    method: 'GET',
    buildQuery: (p) => new URLSearchParams({ feed: p.feed || '', limit: p.limit || '20' }),
  },
};

export async function executeMCPTool(
  server: MCPServer,
  tool: MCPTool,
  params: Record<string, string>,
  apiKey?: string,
): Promise<ToolResult> {
  const endpoint = KNOWN_ENDPOINTS[tool.name];
  if (!endpoint) {
    return {
      toolName: tool.name,
      success: false,
      data: null,
      error: `No known endpoint for tool "${tool.name}". Add endpoint mapping to mcpService.ts.`,
    };
  }

  try {
    const query = endpoint.buildQuery(params);
    const url = `${endpoint.url}${query.toString() ? '?' + query.toString() : ''}`;
    const headers: Record<string, string> = { 'Accept': 'application/json' };

    if (tool.name === 'web_search' || tool.name === 'local_search') {
      const braveKey = apiKey || (typeof import.meta !== 'undefined' ? (import.meta as any).env?.VITE_BRAVE_API_KEY : '') || '';
      if (braveKey) headers['X-Subscription-Token'] = braveKey;
    }

    const res = await fetch(url, { method: endpoint.method, headers });
    if (!res.ok) {
      return {
        toolName: tool.name,
        success: false,
        data: null,
        error: `API error (${res.status}) for ${tool.name}: ${await res.text().catch(() => '')}`,
      };
    }
    const data = await res.json();
    return { toolName: tool.name, success: true, data };
  } catch (err) {
    return {
      toolName: tool.name,
      success: false,
      data: null,
      error: `Execution error for ${tool.name}: ${(err as Error).message}`,
    };
  }
}

export function buildActiveToolsContext(servers: MCPServer[]): string {
  const active = servers.flatMap((s) =>
    s.tools.filter((t) => t.isActive).map((t) => ({
      server: s.name,
      toolName: t.name,
      description: t.description,
      parameters: t.parameters,
    }))
  );
  if (!active.length) return '';
  return `## Available Tools\n${active.map((t) => `- **${t.server}**: \`${t.toolName}(${t.parameters})\` — ${t.description}`).join('\n')}\n\nTo use a tool, respond with: \`!tool <toolName> <param1>=<value> <param2>=<value>\` and I'll execute it for you.\n`;
}

export function parseToolCall(text: string): { toolName: string; params: Record<string, string> } | null {
  const match = text.trim().match(/^!tool\s+(\S+)(?:\s+(.+))?$/i);
  if (!match) return null;
  const toolName = match[1];
  const rawParams = match[2] || '';
  const params: Record<string, string> = {};
  for (const part of rawParams.matchAll(/(\w+)=("[^"]*"|\S+)/g)) {
    params[part[1]] = part[2].replace(/^"|"$/g, '');
  }
  return { toolName, params };
}
