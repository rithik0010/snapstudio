import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Type, Palette, Move, RotateCcw } from 'lucide-react';

const CustomizationPanel = ({ customization, onCustomizationChange }) => {
  const colorOptions = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f8f9fa' },
    { name: 'Dark Gray', value: '#6c757d' },
    { name: 'Black', value: '#000000' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' }
  ];

  const textPositions = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
    { label: 'Center', value: 'center' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-4 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Customization
        </h3>

        {/* Border Color */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-gray-700">Border Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-full h-8 rounded-md border-2 transition-all ${
                  customization.borderColor === color.value
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => onCustomizationChange({ borderColor: color.value })}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-gray-700">Background Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`w-full h-8 rounded-md border-2 transition-all ${
                  customization.backgroundColor === color.value
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => onCustomizationChange({ backgroundColor: color.value })}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="space-y-3 mb-6">
          <Label className="text-sm font-medium text-gray-700">
            Photo Spacing: {customization.spacing}px
          </Label>
          <Slider
            value={[customization.spacing]}
            onValueChange={(value) => onCustomizationChange({ spacing: value[0] })}
            max={50}
            min={0}
            step={5}
            className="w-full"
          />
        </div>

        {/* Text Customization */}
        <div className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-gray-600" />
            <Label className="text-sm font-medium text-gray-700">Add Text</Label>
          </div>
          
          <div className="space-y-3">
            <Textarea
              placeholder="Enter custom text..."
              value={customization.text}
              onChange={(e) => onCustomizationChange({ text: e.target.value })}
              className="resize-none text-sm"
              rows={2}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-gray-600">Text Color</Label>
                <div className="flex space-x-1 mt-1">
                  {colorOptions.slice(0, 6).map((color) => (
                    <button
                      key={color.value}
                      className={`w-6 h-6 rounded border transition-all ${
                        customization.textColor === color.value
                          ? 'border-purple-500 ring-1 ring-purple-200'
                          : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => onCustomizationChange({ textColor: color.value })}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-gray-600">Position</Label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {textPositions.map((pos) => (
                    <Button
                      key={pos.value}
                      variant={customization.textPosition === pos.value ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => onCustomizationChange({ textPosition: pos.value })}
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-gray-600">
                Text Size: {customization.textSize}px
              </Label>
              <Slider
                value={[customization.textSize]}
                onValueChange={(value) => onCustomizationChange({ textSize: value[0] })}
                max={32}
                min={8}
                step={2}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={() => onCustomizationChange({
            borderColor: '#ffffff',
            backgroundColor: '#ffffff',
            spacing: 10,
            text: '',
            textColor: '#000000',
            textSize: 16,
            textPosition: 'bottom'
          })}
          className="w-full text-gray-600 hover:text-gray-800"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export default CustomizationPanel;