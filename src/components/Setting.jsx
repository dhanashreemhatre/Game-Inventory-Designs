import React, { useState } from 'react';
import { Settings, X, Layout, Palette, Box } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const defaultLayouts = {
  standard: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '2', gridRow: '1' },
    inventory: { gridColumn: '3', gridRow: '1' },
    groundItems: { gridColumn: '1 / span 3', gridRow: '2' }
  },
  compact: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '2', gridRow: '1' },
    inventory: { gridColumn: '1 / span 2', gridRow: '2' },
    groundItems: { gridColumn: '1 / span 2', gridRow: '3' }
  },
  widescreen: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '1', gridRow: '2' },
    inventory: { gridColumn: '2 / span 2', gridRow: '1' },
    groundItems: { gridColumn: '2 / span 2', gridRow: '2' }
  }
};


const ColorPicker = ({ label, color, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState(color.split('/')[0] || '#000000');
  const [opacity, setOpacity] = useState(parseInt(color.split('/')[1] || '100'));

  const handleColorChange = (newColor) => {
    setCurrentColor(newColor);
    onChange(`${newColor}/${opacity}`);
  };

  const handleOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    onChange(`${currentColor}/${newOpacity}`);
  };

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-4">
        <label className="w-32 text-sm">{label}:</label>
        <div
          className="w-10 h-10 rounded cursor-pointer border border-gray-600"
          style={{ backgroundColor: hexToRgba(currentColor, opacity / 100) }}
          onClick={() => setShowPicker(!showPicker)}
        />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={opacity} 
          onChange={(e) => handleOpacityChange(e.target.value)}
          className="flex-1"
        />
        <span className="w-12 text-right">{opacity}%</span>
      </div>
      
      {showPicker && (
        <div className="absolute z-10 mt-2">
          <div className="fixed inset-0" onClick={() => setShowPicker(false)} />
          <div className="relative z-20">
            <HexColorPicker color={currentColor} onChange={handleColorChange} />
          </div>
        </div>
      )}
    </div>
  );
};


const VisualLayoutEditor = ({ layout: selectedLayout, onLayoutChange }) => {
  const sections = [
    { id: 'character', label: 'Character' },
    { id: 'quickSlots', label: 'Quick Slots' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'groundItems', label: 'Ground Items' }
  ];

  // Get the actual layout object based on the selected layout name
  const currentLayout = typeof selectedLayout === 'string' 
    ? defaultLayouts[selectedLayout] 
    : selectedLayout;

  const handleLayoutSelect = (layoutName) => {
    onLayoutChange(layoutName);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Layout Templates</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(defaultLayouts).map((layoutName) => (
            <button
              key={layoutName}
              onClick={() => handleLayoutSelect(layoutName)}
              className={`px-4 py-3 rounded flex items-center justify-center gap-2
                ${selectedLayout === layoutName ? 'bg-gray-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              <Layout className="w-4 h-4" />
              {layoutName.charAt(0).toUpperCase() + layoutName.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-gray-700/50 p-4 rounded-lg"
            style={currentLayout[section.id]}
          >
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              {section.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EnhancedSettingsModal = ({ show, onClose, theme, onThemeChange, layout, onLayoutChange }) => {
  const [activeTab, setActiveTab] = useState('theme');

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                activeTab === 'theme' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <Palette className="w-4 h-4" /> Theme
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                activeTab === 'layout' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <Layout className="w-4 h-4" /> Layout
            </button>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-gray-800 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {activeTab === 'theme' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Theme Colors</h3>
            {Object.entries(theme).map(([key, value]) => (
              <ColorPicker
                key={key}
                label={key}
                color={value}
                onChange={(newColor) => {
                  onThemeChange({
                    ...theme,
                    [key]: newColor
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <VisualLayoutEditor 
            layout={layout}
            onLayoutChange={onLayoutChange}
          />
        )}
      </div>
    </div>
  );
};

export default EnhancedSettingsModal;