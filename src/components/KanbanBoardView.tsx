import React, { useState, useEffect } from 'react';
import { KanbanBoard, TaskColumn, TaskCard } from '../types';
import { Kanban, Plus, X, Trash, GripVertical, Edit, Check } from './icons/lucide-shim';
import { dbPut, dbGet } from '../db/indexedDB';

interface Props {
  board: KanbanBoard | null;
  boards: KanbanBoard[];
  onUpdateBoard: (board: KanbanBoard) => void;
  onCreateBoard: (title: string) => void;
  onDeleteBoard: (id: string) => void;
  onSwitchBoard: (id: string) => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/20 text-[var(--text-secondary)]',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

async function saveToIndexedDB(board: KanbanBoard | null) {
  if (!board) return;
  await dbPut('working', {
    id: `kanban-${board.id}`,
    projectId: 'default',
    agentId: 'kanban',
    sessionId: 'kanban',
    key: 'kanban-state',
    value: { columns: board.columns, cards: board.cards },
    createdAt: new Date().toISOString(),
  });
}

async function loadFromIndexedDB(boardId: string): Promise<{ columns: TaskColumn[]; cards: TaskCard[] } | null> {
  const entry = await dbGet<any>('working', `kanban-${boardId}`);
  return entry?.value || null;
}

export const KanbanBoardView: React.FC<Props> = ({
  board, boards, onUpdateBoard, onCreateBoard, onDeleteBoard, onSwitchBoard,
}) => {
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newCardText, setNewCardText] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; colId: string } | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState('');
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editCardData, setEditCardData] = useState<Partial<TaskCard>>({});

  useEffect(() => {
    if (!board) return;
    loadFromIndexedDB(board.id).then((saved) => {
      if (saved) {
        onUpdateBoard({ ...board, columns: saved.columns, cards: saved.cards });
      }
    }).catch(() => {});
  }, [board?.id]);

  const persist = (updatedBoard: KanbanBoard) => {
    onUpdateBoard(updatedBoard);
    saveToIndexedDB(updatedBoard).catch(() => {});
  };

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return;
    onCreateBoard(newBoardTitle.trim());
    setNewBoardTitle('');
    setShowNewBoard(false);
  };

  const addColumn = () => {
    if (!board) return;
    const col: TaskColumn = {
      id: `col-${Date.now()}`,
      title: `Column ${board.columns.length + 1}`,
      color: COLORS[board.columns.length % COLORS.length],
      order: board.columns.length,
    };
    persist({ ...board, columns: [...board.columns, col] });
  };

  const renameColumn = (colId: string) => {
    if (!board || !editingColumnTitle.trim()) return;
    persist({
      ...board,
      columns: board.columns.map((c) => c.id === colId ? { ...c, title: editingColumnTitle.trim() } : c),
    });
    setEditingColumn(null);
  };

  const deleteColumn = (colId: string) => {
    if (!board) return;
    persist({
      ...board,
      columns: board.columns.filter((c) => c.id !== colId),
      cards: board.cards.filter((c) => c.columnId !== colId),
    });
  };

  const addCard = (colId: string) => {
    if (!board || !newCardText.trim()) return;
    const card: TaskCard = {
      id: `card-${Date.now()}`,
      title: newCardText.trim(),
      description: '',
      columnId: colId,
      order: board.cards.filter((c) => c.columnId === colId).length,
      priority: 'medium',
      tags: [],
      createdAt: new Date(),
    };
    persist({ ...board, cards: [...board.cards, card] });
    setNewCardText('');
    setAddingToColumn(null);
  };

  const deleteCard = (cardId: string) => {
    if (!board) return;
    persist({ ...board, cards: board.cards.filter((c) => c.id !== cardId) });
  };

  const updateCard = (cardId: string, updates: Partial<TaskCard>) => {
    if (!board) return;
    persist({
      ...board,
      cards: board.cards.map((c) => c.id === cardId ? { ...c, ...updates } : c),
    });
  };

  const startEditCard = (card: TaskCard) => {
    setEditingCard(card.id);
    setEditCardData({
      title: card.title,
      description: card.description,
      priority: card.priority,
      assignee: card.assignee || '',
      dueDate: card.dueDate || '',
      tags: card.tags,
    });
  };

  const saveEditCard = () => {
    if (!editingCard || !editCardData.title?.trim()) return;
    updateCard(editingCard, {
      title: editCardData.title?.trim() || '',
      description: editCardData.description || '',
      priority: (editCardData.priority as any) || 'medium',
      assignee: editCardData.assignee || undefined,
      dueDate: editCardData.dueDate || undefined,
      tags: editCardData.tags || [],
    });
    setEditingCard(null);
    setEditCardData({});
  };

  const handleDragStart = (cardId: string, colId: string) => {
    setDraggedCard({ cardId, colId });
  };

  const handleDrop = (targetColId: string) => {
    if (!draggedCard || !board) return;
    if (draggedCard.colId === targetColId) { setDraggedCard(null); return; }
    const updatedCards = board.cards.map((c) =>
      c.id === draggedCard.cardId ? { ...c, columnId: targetColId } : c
    );
    persist({ ...board, cards: updatedCards });
    setDraggedCard(null);
  };

  if (!board) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Kanban size={18} className="text-[var(--accent)]" />
          <h2 className="text-sm font-semibold">Kanban Boards</h2>
          <button onClick={() => setShowNewBoard(!showNewBoard)} className="ml-auto p-1 rounded hover:bg-[var(--bg-hover)]" aria-label="Create new board" aria-expanded={showNewBoard}>
            <Plus size={14} />
          </button>
        </div>
        {showNewBoard && (
          <div className="flex gap-2 mb-4">
            <input value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()} placeholder="Board title..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]/50" autoFocus />
            <button onClick={handleCreateBoard} className="px-3 py-1.5 bg-[var(--accent)] text-white text-xs rounded hover:bg-[var(--accent-dark)]">Create</button>
          </div>
        )}
        <div className="text-center py-12 text-[var(--text-muted)]">
          <Kanban size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-xs">No boards yet. Create one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--border)] shrink-0">
        <Kanban size={16} className="text-[var(--accent)]" />
        <select value={board.id} onChange={(e) => onSwitchBoard(e.target.value)} className="bg-transparent text-sm font-medium border-none focus:outline-none cursor-pointer">
          {boards.map((b) => (
            <option key={b.id} value={b.id} className="bg-[var(--bg-secondary)]">{b.title}</option>
          ))}
        </select>
        <button onClick={() => setShowNewBoard(!showNewBoard)} className="p-1 rounded hover:bg-[var(--bg-hover)] ml-1" aria-label="Create new board"><Plus size={12} /></button>
        <button onClick={() => onDeleteBoard(board.id)} className="p-1 rounded hover:bg-red-500/20 text-[var(--text-secondary)] hover:text-red-400 ml-auto" aria-label={`Delete board ${board.title}`}><Trash size={12} /></button>
      </div>
      {showNewBoard && (
        <div className="flex gap-2 px-4 py-2 border-b border-[var(--border)]">
          <input value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()} placeholder="New board title..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)]/50" autoFocus />
          <button onClick={handleCreateBoard} className="px-2 py-1 bg-[var(--accent)] text-white text-xs rounded">Create</button>
        </div>
      )}
      <div className="flex-1 flex gap-3 overflow-x-auto p-4">
        {board.columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64 bg-[var(--bg-secondary)]/50 rounded-lg border border-[var(--border)] flex flex-col max-h-full">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)] shrink-0" style={{ borderLeftColor: col.color, borderLeftWidth: 3 }}>
              {editingColumn === col.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <input
                    value={editingColumnTitle}
                    onChange={(e) => setEditingColumnTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && renameColumn(col.id)}
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-[var(--accent)]/50"
                    autoFocus
                  />
                  <button onClick={() => renameColumn(col.id)} className="p-0.5 hover:text-green-400"><Check size={10} /></button>
                  <button onClick={() => setEditingColumn(null)} className="p-0.5 hover:text-red-400"><X size={10} /></button>
                </div>
              ) : (
                <>
                  <span className="text-xs font-medium flex-1">{col.title}</span>
                  <button onClick={() => { setEditingColumn(col.id); setEditingColumnTitle(col.title); }} className="p-0.5 hover:text-[var(--accent)] opacity-0 group-hover:opacity-100"><Edit size={10} /></button>
                </>
              )}
              <span className="text-[10px] text-[var(--text-muted)] px-1.5 py-0.5 rounded bg-[var(--bg-hover)]">{board.cards.filter((c) => c.columnId === col.id).length}</span>
              <button onClick={() => deleteColumn(col.id)} className="p-0.5 hover:text-red-400" aria-label={`Delete column ${col.title}`}><X size={10} /></button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
              role="list"
              aria-label={`${col.title} tasks`}
            >
              {board.cards.filter((c) => c.columnId === col.id).sort((a, b) => a.order - b.order).map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card.id, col.id)}
                  className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-[var(--accent)]/30 group"
                  role="listitem"
                  aria-grabbed={draggedCard?.cardId === card.id}
                  aria-label={`Task: ${card.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDragStart(card.id, col.id);
                    }
                  }}
                >
                  {editingCard === card.id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        value={editCardData.title || ''}
                        onChange={(e) => setEditCardData((p) => ({ ...p, title: e.target.value }))}
                        placeholder="Title"
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)]/50"
                        autoFocus
                      />
                      <textarea
                        value={editCardData.description || ''}
                        onChange={(e) => setEditCardData((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Description"
                        rows={2}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-1 text-[10px] focus:outline-none focus:border-[var(--accent)]/50 resize-none"
                      />
                      <div className="flex gap-2">
                        <select
                          value={editCardData.priority || 'medium'}
                          onChange={(e) => setEditCardData((p) => ({ ...p, priority: e.target.value as any }))}
                          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                        <input
                          value={editCardData.assignee || ''}
                          onChange={(e) => setEditCardData((p) => ({ ...p, assignee: e.target.value }))}
                          placeholder="Assignee"
                          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[var(--accent)]/50 w-20"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={editCardData.dueDate || ''}
                          onChange={(e) => setEditCardData((p) => ({ ...p, dueDate: e.target.value }))}
                          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[var(--accent)]/50"
                        />
                        <input
                          value={(editCardData.tags || []).join(', ')}
                          onChange={(e) => setEditCardData((p) => ({ ...p, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
                          placeholder="Tags (comma-separated)"
                          className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-[var(--accent)]/50 flex-1"
                        />
                      </div>
                      <div className="flex gap-1 pt-1">
                        <button onClick={saveEditCard} className="px-2 py-1 bg-[var(--accent)] text-white text-[10px] rounded hover:bg-[var(--accent-dark)] flex items-center gap-1"><Check size={10} /> Save</button>
                        <button onClick={() => setEditingCard(null)} className="px-2 py-1 text-[10px] hover:text-red-400">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div onClick={() => startEditCard(card)}>
                      <div className="flex items-start gap-2">
                        <GripVertical size={12} className="text-[var(--text-muted)] mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{card.title}</p>
                          {card.description && <p className="text-[10px] text-[var(--text-muted)] mt-1 line-clamp-2">{card.description}</p>}
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[card.priority] || priorityColors.medium}`}>{card.priority}</span>
                            {card.assignee && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400">{card.assignee}</span>
                            )}
                            {card.dueDate && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">{new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            )}
                            {card.tags.map((t, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-subtler)] text-[var(--accent)]">{t}</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }} className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400 shrink-0"><X size={10} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {addingToColumn === col.id ? (
                <div className="flex gap-1">
                  <input value={newCardText} onChange={(e) => setNewCardText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCard(col.id)} placeholder="Card title..." className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1 text-xs focus:outline-none focus:border-[var(--accent)]/50" autoFocus />
                  <button onClick={() => addCard(col.id)} className="px-2 py-1 bg-[var(--accent)] text-white text-xs rounded">Add</button>
                  <button onClick={() => { setAddingToColumn(null); setNewCardText(''); }} className="px-2 py-1 text-xs hover:text-red-400"><X size={12} /></button>
                </div>
              ) : (
                <button onClick={() => setAddingToColumn(col.id)} className="w-full py-1.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] rounded transition-colors flex items-center justify-center gap-1">
                  <Plus size={10} /> Add card
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addColumn} className="flex-shrink-0 w-64 border-2 border-dashed border-[var(--border)] rounded-lg flex items-center justify-center text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-colors" aria-label="Add column">
          <Plus size={14} className="mr-1" /> Add Column
        </button>
      </div>
    </div>
  );
};
