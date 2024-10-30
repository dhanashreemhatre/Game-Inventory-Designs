import React, { useState } from 'react';
import {  X, Layout, Palette, Box } from 'lucide-react';
import ThemeSelector from './ui/ThemeSelector';


const defaultThemes = {
  Default: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    accent: 'border-emerald-700 bg-emerald-700/10 shadow-md shadow-emerald-500/50 rounded-md',
    text: 'text-gray-100',
    hover: 'hover:border-emerald-200/40 hover:shadow-md hover:shadow-emerald-500/50'
  }
};
const defaultLayouts = {
  standard: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '2', gridRow: '1' },
    inventory: { gridColumn: '3', gridRow: '1' },
    groundItems: { gridColumn: '1 / span 3', gridRow: '2' }
  },
  cyberpunk: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '2', gridRow: '1' },
    inventory: { gridColumn: '1 / span 2', gridRow: '2' },
    groundItems: { gridColumn: '1 / span 2', gridRow: '3' }
  },
  futuristic: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '1', gridRow: '2' },
    inventory: { gridColumn: '2 / span 2', gridRow: '1' },
    groundItems: { gridColumn: '2 / span 2', gridRow: '2' }
  },
  medieval: {
    character: { gridColumn: '1', gridRow: '1' },
    quickSlots: { gridColumn: '1', gridRow: '2' },
    inventory: { gridColumn: '2 / span 2', gridRow: '1' },
    groundItems: { gridColumn: '2 / span 2', gridRow: '2' }
  }
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
        <h3 className="text-lg font-bold mb-4  text-gray-100/55">Layout Templates</h3>
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
      <div className="bg-gray-700/20 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors text-gray-100/55 ${
                activeTab === 'theme' ? 'bg-gray-700' : 'hover:bg-gray-800/20'
              }`}
            >
              <Palette className="w-4 h-4 text-gray-100/55" /> Theme
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors  text-gray-100/55 ${
                activeTab === 'layout' ? 'bg-gray-700' : 'hover:bg-gray-800'
              }`}
            >
              <Layout className="w-4 h-4  text-gray-100/55" /> Layout
            </button>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-white p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white hover:text-black" />
          </button>
        </div>

        {activeTab === 'theme' ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4  text-gray-100/55">Theme Colors</h3>
            <ThemeSelector onThemeChange={onThemeChange} activeTheme={theme} />

            {/* {Object.entries(theme).map(([key, value]) => (
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
            ))} */}
            <div className='text-gray-100/55 text-start mx-10'> <button className='border-white px-4 py-2 rounded bg-gray-700 hover:bg-gray-800' onClick={() => { localStorage.clear();onThemeChange(defaultThemes.Default); }}>
              Reset
            </button></div>
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