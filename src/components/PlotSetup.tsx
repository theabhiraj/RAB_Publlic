import { useState } from 'react';
import { Ruler } from 'lucide-react';

interface PlotSetupProps {
  onStart: (width: number, height: number, unit: 'feet' | 'meters') => void;
}

export default function PlotSetup({ onStart }: PlotSetupProps) {
  const [width, setWidth] = useState('40');
  const [height, setHeight] = useState('60');
  const [unit, setUnit] = useState<'feet' | 'meters'>('feet');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(width);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      onStart(w, h, unit);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Ruler className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2">RAB's 🏠</h1>
        <p className="text-gray-600 text-center mb-8">
          Design your dream home layout with ease
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plot Width
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter width"
              min="1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plot Height
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter height"
              min="1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="feet"
                  checked={unit === 'feet'}
                  onChange={(e) => setUnit(e.target.value as 'feet' | 'meters')}
                  className="mr-2"
                />
                Feet
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="meters"
                  checked={unit === 'meters'}
                  onChange={(e) => setUnit(e.target.value as 'feet' | 'meters')}
                  className="mr-2"
                />
                Meters
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Designing
          </button>
        </form>
      </div>
    </div>
  );
}
