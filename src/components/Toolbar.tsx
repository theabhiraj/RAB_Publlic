import { Trash2, RotateCw, Move } from 'lucide-react';

export type Tool = 'select' | 'erase' | 'rotate';

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

export default function Toolbar({ activeTool, onToolChange }: ToolbarProps) {
  const tools = [
    { id: 'select' as Tool, icon: Move, label: 'Select/Move', shortLabel: 'Select' },
    { id: 'rotate' as Tool, icon: RotateCw, label: 'Rotate', shortLabel: 'Rotate' },
    { id: 'erase' as Tool, icon: Trash2, label: 'Erase', shortLabel: 'Erase' },
  ];

  return (
    <div className="flex gap-1 sm:gap-2 p-2 bg-white border-b overflow-x-auto">
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolChange(tool.id)}
          className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded transition-colors whitespace-nowrap ${
            activeTool === tool.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={tool.label}
        >
          <tool.icon className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-medium hidden xs:inline">{tool.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}
