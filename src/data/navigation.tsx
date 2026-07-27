import React from 'react';
import type { AppView } from '../types';
import {
  MessageSquare, FileText, BarChart, Kanban, Wrench, Database, BookOpen,
  Globe, Layers, Search, Template, Settings,
} from '../components/icons/lucide-shim';

export interface NavItem {
  view: AppView;
  icon: React.ReactNode;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { view: 'chat', icon: <MessageSquare size={14} />, label: 'Chat' },
  { view: 'editor', icon: <FileText size={14} />, label: 'Editor' },
  { view: 'search', icon: <Search size={14} />, label: 'Search' },
  { view: 'observability', icon: <BarChart size={14} />, label: 'Observability' },
  { view: 'kanban', icon: <Kanban size={14} />, label: 'Kanban' },
  { view: 'mcp', icon: <Database size={14} />, label: 'MCP' },
  { view: 'skills', icon: <BookOpen size={14} />, label: 'Skills' },
  { view: 'tools', icon: <Wrench size={14} />, label: 'Tools' },
  { view: 'data', icon: <Layers size={14} />, label: 'Data' },
  { view: 'nlquery', icon: <Search size={14} />, label: 'NL Query' },
  { view: 'knowledge', icon: <Globe size={14} />, label: 'Knowledge' },
  { view: 'docs', icon: <BookOpen size={14} />, label: 'Docs' },
  { view: 'templates', icon: <Template size={14} />, label: 'Templates' },
];
