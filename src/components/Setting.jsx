import React, { useState } from 'react';
import { Settings, X, Layout, Palette } from 'lucide-react';

const ColorPicker = ({ label, color, onChange }) => {
  // Convert Tailwind class to approximate RGB
  const getTailwindColor = (className) => {
    const colorMap = {
      'bg-red-800/40': '#991b1b66',
      'bg-blue-800/40': '#1e40af66',
      'bg-emerald-800/40': '#065f4666',
      'bg-pink-800/40': '#9d174d66',
      'bg-purple-800/40': '#6b21a866',
      'bg-gray-800/50': '#1f293780',
      'bg-black-900': '#000000',
      'bg-white/80': '#ffffffcc'
    };
    return colorMap[className] || '#000000';
  };

  return (
    <div className="flex items-center gap-4 mb-4">
      <label className="w-32 text-sm">{label}:</label>
      <input 
        type="color" 
        value={getTailwindColor(color)}
        onChange={(e) => {
          // This is a simplified conversion - you'd want to map the color to the closest Tailwind class
          const hexColor = e.target.value;
          // For demo, we'll just update with a basic mapping
          let tailwindClass = 'bg-blue-800/40'; // default
          if (hexColor.toLowerCase() === '#991b1b66') tailwindClass = 'bg-red-800/40';
          if (hexColor.toLowerCase() === '#1e40af66') tailwindClass = 'bg-blue-800/40';
          onChange(tailwindClass);
        }}
        className="w-16 h-8 rounded cursor-pointer"
      />
      <select 
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-2 rounded bg-gray-800 text-white"
      >
        <option value="bg-red-800/40">Red</option>
        <option value="bg-blue-800/40">Blue</option>
        <option value="bg-emerald-800/40">Green</option>
        <option value="bg-pink-800/40">Pink</option>
        <option value="bg-purple-800/40">Purple</option>
        <option value="bg-gray-800/50">Gray</option>
      </select>
    </div>
  );
};

const VisualLayoutEditor = ({ layout, onLayoutChange }) => {
  const sections = [
    { id: 'character', label: 'Character' },
    { id: 'quickSlots', label: 'Quick Slots' },
    { id: 'inventory', label: 'Inventory' }
  ];

  // Predefined layout templates
  const templates = [
    {
      id: 'horizontal',
      label: 'Horizontal',
      layout: {
        character: { gridColumn: '1', gridRow: '1' },
        quickSlots: { gridColumn: '2', gridRow: '1' },
        inventory: { gridColumn: '3', gridRow: '1' }
      }
    },
    {
      id: 'vertical',
      label: 'Vertical',
      layout: {
        character: { gridColumn: '1', gridRow: '1' },
        quickSlots: { gridColumn: '1', gridRow: '2' },
        inventory: { gridColumn: '1', gridRow: '3' }
      }
    },
    {
      id: 'compact',
      label: 'Compact',
      layout: {
        character: { gridColumn: '1', gridRow: '1' },
        quickSlots: { gridColumn: '2', gridRow: '1 / 3' },
        inventory: { gridColumn: '1', gridRow: '2' }
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">Layout Templates</h3>
        <div className="flex gap-4 mb-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => onLayoutChange(template.layout)}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800/30 rounded-lg">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-gray-700/50 p-4 rounded-lg cursor-move"
            style={{
              gridColumn: layout[section.id].gridColumn,
              gridRow: layout[section.id].gridRow
            }}
          >
            {section.label}
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
      <div className="bg-gray-900 rounded-lg p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === 'theme' ? 'bg-gray-700' : ''
              }`}
            >
              <Palette className="w-4 h-4" /> Theme
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center gap-2 px-4 py-2 rounded ${
                activeTab === 'layout' ? 'bg-gray-700' : ''
              }`}
            >
              <Layout className="w-4 h-4" /> Layout
            </button>
          </div>
          <button onClick={onClose}>
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
