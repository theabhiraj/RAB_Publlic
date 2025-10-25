import { Plus } from 'lucide-react';

interface RoomType {
  type: string;
  color: string;
  icon: string;
}

interface RoomPaletteProps {
  roomTypes: RoomType[];
  onAddRoom: (type: string, color: string, icon: string) => void;
}

export default function RoomPalette({ roomTypes, onAddRoom }: RoomPaletteProps) {
  return (
    <div className="space-y-2">
      {roomTypes.map(({ type, color, icon }) => (
        <button
          key={type}
          onClick={() => onAddRoom(type, color, icon)}
          className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center text-xl"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <span className="flex-1 text-left font-medium text-sm">{type}</span>
          <Plus className="w-5 h-5 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
