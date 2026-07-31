export interface CollabPresence {
  tabId: string;
  userName: string;
  activeFileId: string | null;
  lastSeen: number;
}

export interface CollabAction {
  type: 'file-update' | 'presence' | 'cursor-move';
  tabId: string;
  payload: any;
}

type CollabListener = (action: CollabAction) => void;

const CHANNEL_NAME = 'oks-collab';
const PRESENCE_INTERVAL = 3000;
const PRESENCE_TIMEOUT = 10000;

let channel: BroadcastChannel | null = null;
let tabId = '';
let userName = 'Anonymous';
let listeners: Set<CollabListener> = new Set();
let presenceTimer: ReturnType<typeof setInterval> | null = null;

function getTabId(): string {
  if (!tabId) {
    const stored = sessionStorage.getItem('oks-tab-id');
    if (stored) { tabId = stored; return tabId; }
    tabId = `tab-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    sessionStorage.setItem('oks-tab-id', tabId);
  }
  return tabId;
}

function broadcast(action: Omit<CollabAction, 'tabId'>): void {
  if (!channel) return;
  try {
    channel.postMessage({ ...action, tabId: getTabId() });
  } catch { /* silently fail */ }
}

function startPresenceBroadcast(activeFileId: string | null): void {
  stopPresenceBroadcast();
  presenceTimer = setInterval(() => {
    broadcast({
      type: 'presence',
      payload: { userName, activeFileId, lastSeen: Date.now() },
    });
  }, PRESENCE_INTERVAL);
}

function stopPresenceBroadcast(): void {
  if (presenceTimer) { clearInterval(presenceTimer); presenceTimer = null; }
}

export function initCollaboration(name?: string): void {
  userName = name || `User-${crypto.randomUUID().slice(0, 8)}`;
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event: MessageEvent) => {
      const action = event.data as CollabAction;
      if (action.tabId === getTabId()) return;
      listeners.forEach((l) => l(action));
    };
  } catch { channel = null; }
}

export function destroyCollaboration(): void {
  stopPresenceBroadcast();
  if (channel) { channel.close(); channel = null; }
  listeners.clear();
}

export function broadcastFileUpdate(fileId: string, content: string, fileName: string): void {
  broadcast({
    type: 'file-update',
    payload: { fileId, content, fileName, timestamp: Date.now() },
  });
}

export function updatePresence(activeFileId: string | null): void {
  startPresenceBroadcast(activeFileId);
  broadcast({
    type: 'presence',
    payload: { userName, activeFileId, lastSeen: Date.now() },
  });
}

export function onCollabAction(listener: CollabListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getActivePeers(actions: CollabAction[]): CollabPresence[] {
  const now = Date.now();
  const peerMap = new Map<string, CollabPresence>();
  for (const a of actions) {
    if (a.type !== 'presence' || a.payload.lastSeen < now - PRESENCE_TIMEOUT) continue;
    peerMap.set(a.tabId, {
      tabId: a.tabId,
      userName: a.payload.userName,
      activeFileId: a.payload.activeFileId,
      lastSeen: a.payload.lastSeen,
    });
  }
  return Array.from(peerMap.values());
}
