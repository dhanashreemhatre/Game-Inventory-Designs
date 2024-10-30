import React from 'react';
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
  },
  Pink: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-pink-700 bg-pink-700/10 shadow-md shadow-pink-500/50 rounded-md',
    text: 'text-pink-100',
    hover: 'hover:border-pink-200/40 hover:shadow-md hover:shadow-pink-500/50'
  },
  RoseGold: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-rose-700 bg-rose-700/10 shadow-md shadow-rose-500/50 rounded-md',
    text: 'text-rose-100',
    hover: 'hover:border-rose-200/40 hover:shadow-md hover:shadow-rose-500/50'
  },
  Teal: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-teal-700 bg-teal-700/10 shadow-md shadow-teal-500/50 rounded-md',
    text: 'text-teal-100',
    hover: 'hover:border-teal-200/40 hover:shadow-md hover:shadow-teal-500/50'
  },
  Cyan: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-cyan-700 bg-cyan-700/10 shadow-md shadow-cyan-500/50 rounded-md',
    text: 'text-cyan-100',
    hover: 'hover:border-cyan-200/40 hover:shadow-md hover:shadow-cyan-500/50'
  },
  Lime: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-lime-700 bg-lime-700/10 shadow-md shadow-lime-500/50 rounded-md',
    text: 'text-lime-100',
    hover: 'hover:border-lime-200/40 hover:shadow-md hover:shadow-lime-500/50'
  },
  Fuchsia: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-fuchsia-700 bg-fuchsia-700/10 shadow-md shadow-fuchsia-500/50 rounded-md',
    text: 'text-lime-100',
    hover: 'hover:border-fuchsia-200/40 hover:shadow-md hover:shadow-fuchsia-500/50'
  },
  Amber: {
    primary: 'bg-zinc-900',
    secondary: 'bg-zinc-800',
    accent: 'border-amber-700 bg-amber-700/10 shadow-md shadow-amber-500/50 rounded-md',
    text: 'text-lime-100',
    hover: 'hover:border-amber-200/40 hover:shadow-md hover:shadow-amber-500/50'
  },
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