import React, { useState } from 'react';
import { Check, Palette } from 'lucide-react';

const defaultThemes = {
  Default: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    accent: 'border-emerald-700 bg-emerald-700/10 shadow-md shadow-emerald-500/50 rounded-md',
    text: 'text-gray-100',
    hover: 'hover:border-emerald-200/40 hover:shadow-md hover:shadow-emerald-500/50'
  },
  Ocean: {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800',
    accent: 'border-blue-700 bg-blue-700/10 shadow-md shadow-blue-500/50 rounded-md',
    text: 'text-blue-100',
    hover: 'hover:border-blue-200/40 hover:shadow-md hover:shadow-blue-500/50'
  },
  Forest: {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800',
    accent: 'border-red-700 bg-red-700/10 shadow-md shadow-red-500/50 rounded-md',
    text: 'text-emerald-100',
    hover: 'hover:border-red-200/40 hover:shadow-md hover:shadow-red-500/50'
  },
  Sunset: {
    primary: 'bg-slate-900',
    secondary: 'bg-slate-800',
    accent: 'border-yellow-700 bg-yellow-700/10 shadow-md shadow-yellow-500/50 rounded-md',
    text: 'text-yellow-100',
    hover: 'hover:border-yellow-200/40 hover:shadow-md hover:shadow-yellow-500/50'
  },
  Dark: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-purple-700 bg-purple-700/10 shadow-md shadow-purple-500/50 rounded-md',
    text: 'text-purple-100',
    hover: 'hover:border-purple-200/40 hover:shadow-md hover:shadow-purple-500/50'
  }
};

const ThemePreview = ({ theme, name, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`${theme.primary} p-4 rounded-lg cursor-pointer transition-all duration-300 ${
      isActive ? 'ring-2 ring-white ring-opacity-60' : ''
    }`}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className={`${theme.text} font-medium`}>{name}</h3>
      {isActive && <Check className="w-5 h-5 text-white" />}
    </div>
    <div className={`${theme.secondary} p-3 rounded-md mb-2`}>
      <div className={`${theme.accent} p-2 mb-2`}>
        <div className={theme.text}>Sample Text</div>
      </div>
      <div className={`${theme.accent} ${theme.hover} p-2`}>
        <div className={theme.text}>Hover Element</div>
      </div>
    </div>
  </div>
);

const ThemeSelector = ({ activeTheme, onThemeChange }) => {
  const handleThemeSelect = (themeName) => {
    const newTheme = defaultThemes[themeName];
    onThemeChange(newTheme);
    localStorage.setItem('customTheme', JSON.stringify(newTheme));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-gray-100" />
        <h2 className="text-xl font-semibold text-gray-100">Theme Selector</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(defaultThemes).map(([name, theme]) => (
          <ThemePreview
            key={name}
            theme={theme}
            name={name}
            isActive={JSON.stringify(theme) === JSON.stringify(activeTheme)}
            onClick={() => handleThemeSelect(name)}
          />
        ))}
      </div>
    </div>
  );
};
export default ThemeSelector;