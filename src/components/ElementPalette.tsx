import { Plus } from 'lucide-react';

interface ElementType {
  type: 'door' | 'window' | 'stairs' | 'furniture';
  subType: string;
  label: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}

interface ElementPaletteProps {
  onAddElement: (element: ElementType) => void;
}

const ELEMENT_TYPES: ElementType[] = [
  { type: 'door', subType: 'single', label: 'Single Door', icon: '🚪', defaultWidth: 40, defaultHeight: 10 },
  { type: 'door', subType: 'double', label: 'Double Door', icon: '🚪🚪', defaultWidth: 60, defaultHeight: 10 },
  { type: 'window', subType: 'standard', label: 'Window', icon: '🪟', defaultWidth: 40, defaultHeight: 10 },
  { type: 'window', subType: 'large', label: 'Large Window', icon: '🪟🪟', defaultWidth: 80, defaultHeight: 10 },
  { type: 'stairs', subType: 'straight', label: 'Stairs', icon: '🪜', defaultWidth: 60, defaultHeight: 100 },
  { type: 'stairs', subType: 'spiral', label: 'Spiral Stairs', icon: '🌀', defaultWidth: 60, defaultHeight: 60 },
  { type: 'furniture', subType: 'bed', label: 'Bed', icon: '🛏️', defaultWidth: 80, defaultHeight: 100 },
  { type: 'furniture', subType: 'sofa', label: 'Sofa', icon: '🛋️', defaultWidth: 100, defaultHeight: 40 },
  { type: 'furniture', subType: 'table', label: 'Dining Table', icon: '🍽️', defaultWidth: 80, defaultHeight: 80 },
  { type: 'furniture', subType: 'desk', label: 'Desk', icon: '🖥️', defaultWidth: 80, defaultHeight: 40 },
  { type: 'furniture', subType: 'chair', label: 'Chair', icon: '🪑', defaultWidth: 30, defaultHeight: 30 },
  { type: 'furniture', subType: 'toilet', label: 'Toilet', icon: '🚽', defaultWidth: 30, defaultHeight: 40 },
  { type: 'furniture', subType: 'sink', label: 'Sink', icon: '🚰', defaultWidth: 40, defaultHeight: 30 },
  { type: 'furniture', subType: 'bathtub', label: 'Bathtub', icon: '🛁', defaultWidth: 60, defaultHeight: 80 },
  { type: 'furniture', subType: 'stove', label: 'Stove', icon: '🔥', defaultWidth: 40, defaultHeight: 40 },
  { type: 'furniture', subType: 'fridge', label: 'Refrigerator', icon: '🧊', defaultWidth: 40, defaultHeight: 40 },
  { type: 'furniture', subType: 'washer', label: 'Washing Machine', icon: '🌀', defaultWidth: 40, defaultHeight: 40 },
  { type: 'furniture', subType: 'plant', label: 'Plant', icon: '🪴', defaultWidth: 30, defaultHeight: 30 },
  { type: 'furniture', subType: 'tv', label: 'TV', icon: '📺', defaultWidth: 60, defaultHeight: 10 },
];

export default function ElementPalette({ onAddElement }: ElementPaletteProps) {
  return (
    <div className="space-y-1">
      {ELEMENT_TYPES.map((element) => (
        <button
          key={`${element.type}-${element.subType}`}
          onClick={() => onAddElement(element)}
          className="w-full flex items-center gap-2 p-2 rounded hover:bg-blue-50 border border-transparent hover:border-blue-300 transition-colors text-left"
        >
          <span className="text-2xl">{element.icon}</span>
          <span className="flex-1 text-sm font-medium">{element.label}</span>
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      ))}
    </div>
  );
}
