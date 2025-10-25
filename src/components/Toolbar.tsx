import { Trash2, RotateCw, Move } from 'lucide-react';

export type Tool = 'select' | 'erase' | 'rotate';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  const tools = [
    { id: 'select' as Tool, icon: Move, label: 'Select/Move' },
    { id: 'rotate' as Tool, icon: RotateCw, label: 'Rotate' },
    { id: 'erase' as Tool, icon: Trash2, label: 'Erase' },
  ];

  return (
    <div className="flex gap-2 p-2 bg-white border-b">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTool === tool.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{tool.label}</span>
        </button>
      ))}
    </div>
  );
}
