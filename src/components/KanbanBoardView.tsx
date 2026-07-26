import React, { useState } from 'react';
import { KanbanBoard, TaskColumn, TaskCard } from '../types';
import { Kanban, Plus, X, Trash, GripVertical } from './icons/lucide-shim';

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
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-500/20 text-red-400',
};

export const KanbanBoardView: React.FC<Props> = ({
  board, boards, onUpdateBoard, onCreateBoard, onDeleteBoard, onSwitchBoard,
}) => {
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newCardText, setNewCardText] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; colId: string } | null>(null);

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
    onUpdateBoard({ ...board, columns: [...board.columns, col] });
  };

  const deleteColumn = (colId: string) => {
    if (!board) return;
    onUpdateBoard({
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
    onUpdateBoard({ ...board, cards: [...board.cards, card] });
    setNewCardText('');
    setAddingToColumn(null);
  };

  const deleteCard = (cardId: string) => {
    if (!board) return;
    onUpdateBoard({ ...board, cards: board.cards.filter((c) => c.id !== cardId) });
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
    onUpdateBoard({ ...board, cards: updatedCards });
    setDraggedCard(null);
  };

  if (!board) {
    return (
      <div className="p-4 h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <Kanban size={18} className="text-indigo-400" />
          <h2 className="text-sm font-semibold">Kanban Boards</h2>
          <button onClick={() => setShowNewBoard(!showNewBoard)} className="ml-auto p-1 rounded hover:bg-[#2a2a3e]">
            <Plus size={14} />
          </button>
        </div>
        {showNewBoard && (
          <div className="flex gap-2 mb-4">
            <input value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()} placeholder="Board title..." className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500/50" autoFocus />
            <button onClick={handleCreateBoard} className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Create</button>
          </div>
        )}
        <div className="text-center py-12 text-gray-500">
          <Kanban size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-xs">No boards yet. Create one to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2a2a3e] shrink-0">
        <Kanban size={16} className="text-indigo-400" />
        <select value={board.id} onChange={(e) => onSwitchBoard(e.target.value)} className="bg-transparent text-sm font-medium border-none focus:outline-none cursor-pointer">
          {boards.map((b) => (
            <option key={b.id} value={b.id} className="bg-[#1a1a2e]">{b.title}</option>
          ))}
        </select>
        <button onClick={() => setShowNewBoard(!showNewBoard)} className="p-1 rounded hover:bg-[#2a2a3e] ml-1"><Plus size={12} /></button>
        <button onClick={() => onDeleteBoard(board.id)} className="p-1 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 ml-auto"><Trash size={12} /></button>
      </div>
      {showNewBoard && (
        <div className="flex gap-2 px-4 py-2 border-b border-[#2a2a3e]">
          <input value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateBoard()} placeholder="New board title..." className="flex-1 bg-[#1a1a2e] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50" autoFocus />
          <button onClick={handleCreateBoard} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">Create</button>
        </div>
      )}
      <div className="flex-1 flex gap-3 overflow-x-auto p-4">
        {board.columns.map((col) => (
          <div key={col.id} className="flex-shrink-0 w-64 bg-[#1a1a2e]/50 rounded-lg border border-[#2a2a3e] flex flex-col max-h-full">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#2a2a3e] shrink-0" style={{ borderLeftColor: col.color, borderLeftWidth: 3 }}>
              <span className="text-xs font-medium flex-1">{col.title}</span>
              <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-[#2a2a3e]">{board.cards.filter((c) => c.columnId === col.id).length}</span>
              <button onClick={() => deleteColumn(col.id)} className="p-0.5 hover:text-red-400"><X size={10} /></button>
            </div>
            <div
              className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(col.id)}
            >
              {board.cards.filter((c) => c.columnId === col.id).sort((a, b) => a.order - b.order).map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card.id, col.id)}
                  className="bg-[#0f0f1a] border border-[#2a2a3e] rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-indigo-500/30 group"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical size={12} className="text-gray-600 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{card.title}</p>
                      {card.description && <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{card.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[card.priority] || priorityColors.medium}`}>{card.priority}</span>
                        {card.tags.map((t, i) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">{t}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => deleteCard(card.id)} className="p-0.5 opacity-0 group-hover:opacity-100 hover:text-red-400 shrink-0"><X size={10} /></button>
                  </div>
                </div>
              ))}
              {addingToColumn === col.id ? (
                <div className="flex gap-1">
                  <input value={newCardText} onChange={(e) => setNewCardText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addCard(col.id)} placeholder="Card title..." className="flex-1 bg-[#0f0f1a] border border-[#2a2a3e] rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500/50" autoFocus />
                  <button onClick={() => addCard(col.id)} className="px-2 py-1 bg-indigo-600 text-white text-xs rounded">Add</button>
                  <button onClick={() => { setAddingToColumn(null); setNewCardText(''); }} className="px-2 py-1 text-xs hover:text-red-400"><X size={12} /></button>
                </div>
              ) : (
                <button onClick={() => setAddingToColumn(col.id)} className="w-full py-1.5 text-[10px] text-gray-500 hover:text-gray-300 hover:bg-[#2a2a3e] rounded transition-colors flex items-center justify-center gap-1">
                  <Plus size={10} /> Add card
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={addColumn} className="flex-shrink-0 w-64 border-2 border-dashed border-[#2a2a3e] rounded-lg flex items-center justify-center text-xs text-gray-500 hover:text-gray-300 hover:border-indigo-500/50 transition-colors">
          <Plus size={14} className="mr-1" /> Add Column
        </button>
      </div>
    </div>
  );
};
