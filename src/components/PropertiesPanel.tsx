import { Trash2, RotateCw, Move, Copy, Maximize2, Palette, Droplet, Edit3 } from 'lucide-react';
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
      <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <Move className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
          </div>
          <p className="text-sm lg:text-base font-medium text-gray-600">No item selected</p>
          <p className="text-xs lg:text-sm text-gray-400 mt-1">Tap an item to edit properties</p>
        </div>
      </div>
    );
  }

  if (selectedRoom) {
    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-white overflow-y-auto lg:overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-blue-200 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl lg:text-3xl">
              {selectedRoom.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm lg:text-lg text-white truncate">
                {selectedRoom.type}
              </h2>
              <p className="text-xs text-blue-100">Room Properties</p>
            </div>
          </div>
        </div>

        <div className="p-2 lg:p-4 flex flex-col gap-2 lg:gap-3 overflow-y-auto">
          {/* Room Type */}
          <div className="w-full bg-white rounded-xl shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              <label className="text-xs lg:text-sm font-semibold text-gray-700">
                Room Name
              </label>
            </div>
            <input
              type="text"
              value={selectedRoom.type}
              onChange={(e) => onUpdateRoom({ ...selectedRoom, type: e.target.value })}
              className="w-full px-3 py-2 text-sm font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
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
          <div className="w-full bg-white rounded-xl shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Maximize2 className="w-4 h-4 text-blue-600" />
              <div className="text-xs lg:text-sm font-semibold text-gray-700">Dimensions (Feet)</div>
            </div>
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
          <div className="w-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-4 border border-blue-400">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-blue-100">Total Area</span>
              <span className="text-2xl lg:text-3xl font-bold text-white">
                {calculateArea(selectedRoom)}
              </span>
              <span className="text-xs font-medium text-blue-100">square feet</span>
            </div>
          </div>

          {/* Color Picker */}
          <div className="w-full bg-white rounded-xl shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-blue-600" />
              <label className="text-xs lg:text-sm font-semibold text-gray-700">
                Color
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2 mb-3">
              {[
                '#93c5fd', '#fca5a5', '#a5f3fc', '#d9f99d', 
                '#fde68a', '#86efac', '#d4d4d8', '#c4b5fd',
                '#bfdbfe', '#e9d5ff', '#fbbf24', '#fb923c'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => onUpdateRoom({ ...selectedRoom, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedRoom.color === color ? 'border-blue-600 scale-110 shadow-lg' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedRoom.color}
              onChange={(e) => onUpdateRoom({ ...selectedRoom, color: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer border-2 border-gray-200"
            />
          </div>

          {/* Opacity Slider */}
          <div className="w-full bg-white rounded-xl shadow-md p-3 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <Droplet className="w-4 h-4 text-blue-600" />
              <label className="text-xs lg:text-sm font-semibold text-gray-700">
                Opacity
              </label>
              <span className="ml-auto text-sm font-bold text-blue-600">
                {Math.round((selectedRoom.opacity ?? 0.85) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={(selectedRoom.opacity ?? 0.85) * 100}
              onChange={(e) => onUpdateRoom({ ...selectedRoom, opacity: parseInt(e.target.value) / 100 })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
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
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={onDuplicateRoom}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Copy className="w-5 h-5" />
              <span>Duplicate Room</span>
            </button>
            <button
              onClick={onDeleteRoom}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Room</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedElement) {
    return (
      <div className="w-full bg-gradient-to-br from-purple-50 to-white overflow-y-auto lg:overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className="p-3 lg:p-4 border-b border-purple-200 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl lg:text-3xl">
              {selectedElement.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-sm lg:text-lg text-white truncate capitalize">
                {selectedElement.subType || selectedElement.type}
              </h2>
              <p className="text-xs text-purple-100">Element Properties</p>
            </div>
          </div>
        </div>

        <div className="p-2 lg:p-4 flex flex-col gap-2 lg:gap-3 overflow-y-auto">
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
          <div className="w-full flex flex-col gap-2">
            <button
              onClick={onRotateElement}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <RotateCw className="w-5 h-5" />
              <span>Rotate 90°</span>
            </button>
            <button
              onClick={onDuplicateElement}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Copy className="w-5 h-5" />
              <span>Duplicate Element</span>
            </button>
            <button
              onClick={onDeleteElement}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Element</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
