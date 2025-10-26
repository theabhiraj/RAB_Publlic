import { Trash2, RotateCw, Move, Copy } from 'lucide-react';
import { Room, Element } from '../types';

interface PropertiesPanelProps {
  selectedRoom: Room | null;
  selectedElement: Element | null;
  onUpdateRoom: (room: Room) => void;
  onUpdateElement: (element: Element) => void;
  onDeleteRoom: () => void;
  onDeleteElement: () => void;
  onRotateElement: () => void;
  onDuplicateRoom: () => void;
  onDuplicateElement: () => void;
  calculateArea: (room: Room) => string;
}

export default function PropertiesPanel({
  selectedRoom,
  selectedElement,
  onUpdateRoom,
  onUpdateElement,
  onDeleteRoom,
  onDeleteElement,
  onRotateElement,
  onDuplicateRoom,
  onDuplicateElement,
  calculateArea,
}: PropertiesPanelProps) {
  if (!selectedRoom && !selectedElement) {
    return (
      <div className="w-full bg-white p-4 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Move className="w-8 h-8 lg:w-12 lg:h-12 mx-auto mb-2 opacity-50" />
          <p className="text-xs lg:text-sm">Select item</p>
          <p className="text-xs mt-1 hidden lg:block">to view properties</p>
        </div>
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <div className="w-full bg-white overflow-y-auto">
        <div className="p-2 lg:p-4 border-b bg-blue-50">
          <h2 className="font-bold text-sm lg:text-lg flex items-center gap-1 lg:gap-2">
            <span className="text-lg lg:text-2xl">{selectedRoom.icon}</span>
            <span className="hidden lg:inline">Room Properties</span>
            <span className="lg:hidden">Room</span>
          </h2>
        </div>

        <div className="p-2 lg:p-4 space-y-2 lg:space-y-4">
          {/* Room Type */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              value={selectedRoom.type}
              onChange={(e) => onUpdateRoom({ ...selectedRoom, type: e.target.value })}
              className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Position - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X Position
              </label>
              <input
                type="number"
                value={Math.round(selectedRoom.x)}
                onChange={(e) => onUpdateRoom({ ...selectedRoom, x: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Y Position
              </label>
              <input
                type="number"
                value={Math.round(selectedRoom.y)}
                onChange={(e) => onUpdateRoom({ ...selectedRoom, y: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (pixels)
              </label>
              <input
                type="number"
                value={Math.round(selectedRoom.width)}
                onChange={(e) => onUpdateRoom({ ...selectedRoom, width: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (pixels)
              </label>
              <input
                type="number"
                value={Math.round(selectedRoom.height)}
                onChange={(e) => onUpdateRoom({ ...selectedRoom, height: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Dimensions in Feet - Editable */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Dimensions (Feet)</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={(selectedRoom.width / 20).toFixed(1)}
                  onChange={(e) => {
                    const feetValue = parseFloat(e.target.value) || 0;
                    const pixels = Math.max(0, feetValue * 20);
                    onUpdateRoom({ ...selectedRoom, width: pixels });
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold text-blue-600"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={(selectedRoom.height / 20).toFixed(1)}
                  onChange={(e) => {
                    const feetValue = parseFloat(e.target.value) || 0;
                    const pixels = Math.max(0, feetValue * 20);
                    onUpdateRoom({ ...selectedRoom, height: pixels });
                  }}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-bold text-blue-600"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Area Display */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Area</span>
              <span className="text-lg font-bold text-blue-600">
                {calculateArea(selectedRoom)} sq ft
              </span>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                '#93c5fd', '#fca5a5', '#a5f3fc', '#d9f99d', 
                '#fde68a', '#86efac', '#d4d4d8', '#c4b5fd',
                '#bfdbfe', '#e9d5ff', '#fbbf24', '#fb923c'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => onUpdateRoom({ ...selectedRoom, color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    selectedRoom.color === color ? 'border-blue-600 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedRoom.color}
              onChange={(e) => onUpdateRoom({ ...selectedRoom, color: e.target.value })}
              className="w-full mt-2 h-10 rounded cursor-pointer"
            />
          </div>

          {/* Opacity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={(selectedRoom.opacity ?? 0.85) * 100}
                onChange={(e) => onUpdateRoom({ ...selectedRoom, opacity: parseInt(e.target.value) / 100 })}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {Math.round((selectedRoom.opacity ?? 0.85) * 100)}%
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdateRoom({ ...selectedRoom, opacity: 0.25 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                25%
              </button>
              <button
                onClick={() => onUpdateRoom({ ...selectedRoom, opacity: 0.5 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                50%
              </button>
              <button
                onClick={() => onUpdateRoom({ ...selectedRoom, opacity: 0.75 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                75%
              </button>
              <button
                onClick={() => onUpdateRoom({ ...selectedRoom, opacity: 1 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                100%
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 lg:pt-4 border-t space-y-1.5 lg:space-y-2">
            <button
              onClick={onDuplicateRoom}
              className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 lg:gap-2 font-medium text-sm"
            >
              <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Duplicate Room</span>
              <span className="lg:hidden">Duplicate</span>
            </button>
            <button
              onClick={onDeleteRoom}
              className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 lg:gap-2 font-medium text-sm"
            >
              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Delete Room</span>
              <span className="lg:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedElement) {
    return (
      <div className="w-full bg-white overflow-y-auto">
        <div className="p-2 lg:p-4 border-b bg-purple-50">
          <h2 className="font-bold text-sm lg:text-lg flex items-center gap-1 lg:gap-2">
            <span className="text-lg lg:text-2xl">{selectedElement.icon}</span>
            <span className="hidden lg:inline">Element Properties</span>
            <span className="lg:hidden">Element</span>
          </h2>
        </div>

        <div className="p-2 lg:p-4 space-y-2 lg:space-y-4">
          {/* Element Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              value={selectedElement.subType || selectedElement.type}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 capitalize"
            />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                X Position
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.x)}
                onChange={(e) => onUpdateElement({ ...selectedElement, x: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Y Position
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.y)}
                onChange={(e) => onUpdateElement({ ...selectedElement, y: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (pixels)
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.width)}
                onChange={(e) => onUpdateElement({ ...selectedElement, width: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (pixels)
              </label>
              <input
                type="number"
                value={Math.round(selectedElement.height)}
                onChange={(e) => onUpdateElement({ ...selectedElement, height: Math.max(0, parseInt(e.target.value) || 0) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>
          </div>

          {/* Dimensions in Feet - Editable */}
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Dimensions (Feet)</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={(selectedElement.width / 20).toFixed(1)}
                  onChange={(e) => {
                    const feetValue = parseFloat(e.target.value) || 0;
                    const pixels = Math.max(0, feetValue * 20);
                    onUpdateElement({ ...selectedElement, width: pixels });
                  }}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-bold text-purple-600"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={(selectedElement.height / 20).toFixed(1)}
                  onChange={(e) => {
                    const feetValue = parseFloat(e.target.value) || 0;
                    const pixels = Math.max(0, feetValue * 20);
                    onUpdateElement({ ...selectedElement, height: pixels });
                  }}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center font-bold text-purple-600"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={selectedElement.rotation}
                onChange={(e) => onUpdateElement({ ...selectedElement, rotation: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {selectedElement.rotation}°
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdateElement({ ...selectedElement, rotation: 0 })}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                0°
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, rotation: 90 })}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                90°
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, rotation: 180 })}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                180°
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, rotation: 270 })}
                className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                270°
              </button>
            </div>
          </div>

          {/* Opacity Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={(selectedElement.opacity ?? 1) * 100}
                onChange={(e) => onUpdateElement({ ...selectedElement, opacity: parseInt(e.target.value) / 100 })}
                className="flex-1"
              />
              <span className="text-sm font-medium w-12 text-right">
                {Math.round((selectedElement.opacity ?? 1) * 100)}%
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onUpdateElement({ ...selectedElement, opacity: 0.25 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                25%
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, opacity: 0.5 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                50%
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, opacity: 0.75 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                75%
              </button>
              <button
                onClick={() => onUpdateElement({ ...selectedElement, opacity: 1 })}
                className="flex-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                100%
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 lg:pt-4 border-t space-y-1.5 lg:space-y-2">
            <button
              onClick={onRotateElement}
              className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 lg:gap-2 font-medium text-sm"
            >
              <RotateCw className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Rotate 90°</span>
              <span className="lg:hidden">Rotate</span>
            </button>
            <button
              onClick={onDuplicateElement}
              className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-1 lg:gap-2 font-medium text-sm"
            >
              <Copy className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Duplicate Element</span>
              <span className="lg:hidden">Duplicate</span>
            </button>
            <button
              onClick={onDeleteElement}
              className="w-full px-2 lg:px-4 py-2 lg:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-1 lg:gap-2 font-medium text-sm"
            >
              <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="hidden lg:inline">Delete Element</span>
              <span className="lg:hidden">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
