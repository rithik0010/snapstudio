import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockData } from '../utils/mockData';

const FilterPanel = ({ selectedFilter, onFilterChange }) => {
  const filterCategories = [
    { key: 'vintage', label: 'Vintage & Retro', color: 'bg-amber-100 text-amber-800' },
    { key: 'cinematic', label: 'Cinematic', color: 'bg-blue-100 text-blue-800' },
    { key: 'modern', label: 'Modern', color: 'bg-green-100 text-green-800' },
    { key: 'artistic', label: 'Artistic', color: 'bg-purple-100 text-purple-800' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Filters</h3>
        {selectedFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange(null)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>

      {filterCategories.map((category) => (
        <div key={category.key} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`text-xs ${category.color}`}>
              {category.label}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {mockData.filters[category.key].map((filter) => (
              <div
                key={filter.id}
                className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
                  selectedFilter === filter.id
                    ? 'ring-2 ring-purple-500 ring-offset-2'
                    : 'hover:ring-1 hover:ring-gray-300'
                }`}
                onClick={() => onFilterChange(filter.id)}
              >
                {/* Filter Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200"
                    style={{ filter: filter.css }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                      <span className="text-xs font-medium text-gray-800">
                        {filter.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Filter Name */}
                <div className="p-2 bg-white">
                  <p className="text-xs font-medium text-gray-900 text-center">
                    {filter.name}
                  </p>
                </div>
                
                {/* Selected Indicator */}
                {selectedFilter === filter.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterPanel;