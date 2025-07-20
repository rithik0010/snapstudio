import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Grid3x3, LayoutGrid, Image, Columns } from 'lucide-react';
import { mockData } from '../utils/mockData';

const LayoutPanel = ({ selectedLayout, onLayoutChange }) => {
  const getLayoutIcon = (layout) => {
    switch (layout.type) {
      case 'strip':
        return <Columns className="w-4 h-4" />;
      case 'grid':
        return <Grid3x3 className="w-4 h-4" />;
      case 'single':
        return <Image className="w-4 h-4" />;
      default:
        return <LayoutGrid className="w-4 h-4" />;
    }
  };

  const getLayoutPreview = (layout) => {
    const slots = Array.from({ length: layout.slots }, (_, i) => i);
    
    if (layout.type === 'strip') {
      return (
        <div className="flex flex-col h-full gap-0.5">
          {slots.map((slot) => (
            <div key={slot} className="flex-1 bg-purple-300 rounded-sm" />
          ))}
        </div>
      );
    }
    
    if (layout.type === 'grid') {
      const cols = layout.id === 'grid-2x2' ? 2 : 3;
      return (
        <div 
          className="grid h-full gap-0.5"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {slots.map((slot) => (
            <div key={slot} className="bg-purple-300 rounded-sm" />
          ))}
        </div>
      );
    }
    
    if (layout.type === 'single') {
      return <div className="w-full h-full bg-purple-300 rounded-sm" />;
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Layouts</h3>
        <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
          {mockData.layouts.find(l => l.id === selectedLayout)?.name || 'Select Layout'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {mockData.layouts.map((layout) => (
          <div
            key={layout.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all border-2 ${
              selectedLayout === layout.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
            onClick={() => onLayoutChange(layout.id)}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getLayoutIcon(layout)}
                  <span className="font-medium text-sm text-gray-900">
                    {layout.name}
                  </span>
                </div>
                {selectedLayout === layout.id && (
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
              
              {/* Layout Preview */}
              <div className="aspect-[4/3] bg-gray-100 rounded border p-2">
                {getLayoutPreview(layout)}
              </div>
              
              <div className="mt-2 text-xs text-gray-500 text-center">
                {layout.slots} {layout.slots === 1 ? 'photo' : 'photos'} • {layout.dimensions.width}x{layout.dimensions.height}px
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayoutPanel;