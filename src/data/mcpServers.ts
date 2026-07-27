import { MCPServer } from '../types';

export const DEFAULT_MCP_SERVERS: MCPServer[] = [
  {
    id: 'mcp-cdc', name: 'CDC Disease Surveillance', description: 'Real-time CDC notifiable disease surveillance, vaccination rates, and health statistics via Socrata Open Data API', status: 'disconnected',
    tools: [
      { name: 'get_nndss_surveillance', description: 'Query NNDSS notifiable disease data by disease type and year', parameters: 'disease: string, year?: number, state?: string', isActive: true },
      { name: 'get_places_data', description: 'Get PLACES county-level health measures', parameters: 'measure: string, year: number, state?: string', isActive: true },
      { name: 'search_dataset', description: 'Search across 73 CDC public health datasets', parameters: 'query: string, dataset?: string, limit?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-who', name: 'WHO Global Health Observatory', description: 'WHO GHO OData API for global health indicators, mortality, disease burden, and SDG tracker data', status: 'disconnected',
    tools: [
      { name: 'get_gho_indicator', description: 'Fetch WHO health indicator data by code', parameters: 'indicator: string, country?: string, year?: number', isActive: true },
      { name: 'search_indicators', description: 'Search available WHO health indicators', parameters: 'query: string', isActive: true },
      { name: 'get_dimension_values', description: 'Get WHO dimension values (countries, regions)', parameters: 'dimension: string', isActive: true },
    ],
  },
  {
    id: 'mcp-delphi', name: 'CMU Delphi Epidata', description: 'Carnegie Mellon Delphi Group epidemiological surveillance data including COVID-19, influenza, and dengue', status: 'disconnected',
    tools: [
      { name: 'get_fluview', description: 'Get influenza-like illness surveillance data', parameters: 'regions: string, epiweeks: string', isActive: true },
      { name: 'get_covidcast', description: 'Get COVID-19 surveillance signals', parameters: 'signal: string, geo_type: string, geo_values: string', isActive: true },
      { name: 'get_dengue_nowcast', description: 'Get dengue nowcast estimates', parameters: 'epiweeks?: string', isActive: true },
    ],
  },
  {
    id: 'mcp-infectonet', description: 'InfectoNET global viral genomic surveillance for 50+ pathogens with outbreak alerts', status: 'disconnected', name: 'InfectoNET Genomic Surveillance',
    tools: [
      { name: 'list_pathogens', description: 'List all tracked viral pathogens with sequence counts', parameters: '', isActive: true },
      { name: 'get_pathogen_data', description: 'Get genomic sequence records for a specific pathogen', parameters: 'pathogen: string, limit?: number', isActive: true },
      { name: 'get_outbreak_alerts', description: 'Get live outbreak alerts from WHO/PAHO/ReliefWeb', parameters: 'pathogen?: string', isActive: true },
    ],
  },
  {
    id: 'mcp-brave', name: 'Brave Search', description: 'Web and local search using Brave Search API (requires API key)', status: 'disconnected',
    tools: [
      { name: 'web_search', description: 'Search the web', parameters: 'query: string, count?: number', isActive: true },
      { name: 'local_search', description: 'Search for local businesses and places', parameters: 'query: string, country?: string', isActive: true },
    ],
  },
  {
    id: 'mcp-github-api', name: 'GitHub API', description: 'GitHub REST API for repositories, code search, issues, pull requests, and releases', status: 'disconnected',
    tools: [
      { name: 'github_user_repos', description: 'List repositories for the authenticated user', parameters: 'perPage?: number, sort?: string, type?: string', isActive: true },
      { name: 'github_search_code', description: 'Search code across public repositories', parameters: 'query: string, perPage?: number', isActive: true },
      { name: 'github_search_issues', description: 'Search issues and pull requests', parameters: 'query: string, perPage?: number', isActive: true },
      { name: 'github_list_commits', description: 'List commits in a repository', parameters: 'owner: string, repo: string, perPage?: number, branch?: string', isActive: true },
      { name: 'github_list_pulls', description: 'List pull requests in a repository', parameters: 'owner: string, repo: string, state?: string, perPage?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-world-bank', name: 'World Bank Data', description: 'World Bank API for development indicators, country data, and economic statistics', status: 'disconnected',
    tools: [
      { name: 'world_bank_indicator', description: 'Fetch World Bank indicator data for a country', parameters: 'indicator: string, country: string, date?: string, perPage?: number', isActive: true },
      { name: 'world_bank_countries', description: 'List countries and regions with metadata', parameters: 'perPage?: number, region?: string', isActive: true },
      { name: 'world_bank_indicators_list', description: 'List all available World Bank indicators', parameters: 'perPage?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-open-library', name: 'Open Library', description: 'Open Library API for searching books, works, and subjects', status: 'disconnected',
    tools: [
      { name: 'open_library_search', description: 'Search for books and works', parameters: 'query: string, limit?: number, page?: number', isActive: true },
      { name: 'open_library_subjects', description: 'Get books by subject', parameters: 'subject: string, limit?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-news', name: 'News Headlines', description: 'News API for top headlines and article search across health, science, and technology', status: 'disconnected',
    tools: [
      { name: 'newsapi_top_headlines', description: 'Get top news headlines', parameters: 'country?: string, category?: string, pageSize?: number', isActive: true },
      { name: 'newsapi_everything', description: 'Search all news articles', parameters: 'query: string, sortBy?: string, pageSize?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-google-books', name: 'Google Books', description: 'Google Books API for searching publications, reviews, and metadata', status: 'disconnected',
    tools: [
      { name: 'google_books_search', description: 'Search for books and volumes', parameters: 'query: string, maxResults?: number, lang?: string', isActive: true },
      { name: 'google_books_volume', description: 'Get details for a specific volume', parameters: 'volumeId: string', isActive: true },
    ],
  },
  {
    id: 'mcp-ejentum', name: 'Ejentum MCP', description: 'Reasoning, code analysis, anti-deception, and memory tools for AI agents', status: 'disconnected',
    tools: [
      { name: 'ejentum_reason', description: 'Multi-step reasoning with structured deliberation', parameters: 'problem: string, context?: string, framework?: string', isActive: true },
      { name: 'ejentum_analyze_code', description: 'Analyze source code for bugs, security issues, and anti-patterns', parameters: 'code: string, analysis_type?: string, language?: string', isActive: true },
      { name: 'ejentum_anti_deception', description: 'Detect deceptive patterns and hallucination risks in statements', parameters: 'statement: string, confidence?: string', isActive: true },
      { name: 'ejentum_memory', description: 'Persistent key-value memory with semantic retrieval', parameters: 'action: string, key?: string, value?: string', isActive: true },
    ],
  },
  {
    id: 'mcp-reliefweb', name: 'ReliefWeb Data', description: 'OCHA ReliefWeb API for humanitarian reports, situation updates, and disaster tracking', status: 'disconnected',
    tools: [
      { name: 'reliefweb_search_reports', description: 'Search humanitarian reports by country and keyword', parameters: 'query?: string, country?: string, limit?: number', isActive: true },
      { name: 'reliefweb_get_report', description: 'Get detailed humanitarian report by ID', parameters: 'id: string', isActive: true },
      { name: 'reliefweb_list_disasters', description: 'List current disasters with latest updates', parameters: 'limit?: number', isActive: true },
    ],
  },
  {
    id: 'mcp-who-data', name: 'WHO data.who.int', description: 'WHO GHO OData API via data.who.int for global health indicators and SDG tracker data', status: 'disconnected',
    tools: [
      { name: 'who_data_indicator', description: 'Fetch WHO health indicator data by code from data.who.int', parameters: 'indicator: string, country?: string, limit?: number', isActive: true },
      { name: 'who_data_search', description: 'Search WHO health indicators and datasets', parameters: 'query: string, limit?: number', isActive: true },
    ],
  },
];
