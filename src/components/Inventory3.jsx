import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Package, User, Zap, Settings, Save, Layout, PaintBucket } from 'lucide-react';
import { Slider } from './ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// Theme definitions
const THEMES = {
  Default: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    accent: 'border-gray-700',
    text: 'text-gray-100',
  },
  Emerald: {
    primary: 'bg-emerald-900',
    secondary: 'bg-emerald-800',
    accent: 'border-emerald-700',
    text: 'text-emerald-100',
  },
  Azure: {
    primary: 'bg-blue-900',
    secondary: 'bg-blue-800',
    accent: 'border-blue-700',
    text: 'text-blue-100',
  },
  Rose: {
    primary: 'bg-rose-900',
    secondary: 'bg-rose-800',
    accent: 'border-rose-700',
    text: 'text-rose-100',
  },
};

// Draggable Panel Component
const DraggablePanel = ({ children, id, onLayoutChange, gridArea }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'PANEL',
    item: { id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        gridArea,
        cursor: 'move',
      }}
      className="relative"
    >
      {children}
    </div>
  );
};

// Main Component
const InventorySystem = () => {
  const [theme, setTheme] = useState(THEMES.Default);

  const [layout, setLayout] = useState({
    columns: 4,
    gap: 4,
    panelSizes: {
      equipment: { w: 1, h: 2 },
      inventory: { w: 2, h: 2 },
      quickAccess: { w: 1, h: 1 },
      ground: { w: 4, h: 1 },
    },
  });

  const [showSettings, setShowSettings] = useState(false);
  const [inventory] = useState(Array(20).fill(null));
  const [quickSlots] = useState(Array(8).fill(null));

  // Settings Modal
  const SettingsModal = ({ show, onClose }) => (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className={`${theme.primary} border-0 max-w-2xl`}>
        <DialogHeader>
          <DialogTitle className={`${theme.text} flex items-center gap-2`}>
            <Settings className="w-5 h-5" /> Customize Interface
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Layout Controls */}
          <div className={`${theme.secondary} p-4 rounded-lg space-y-4`}>
            <h3 className={`${theme.text} font-bold flex items-center gap-2`}>
              <Layout className="w-4 h-4" /> Layout Settings
            </h3>
            
            <div className="space-y-2">
              <label className={`${theme.text} text-sm`}>Grid Columns</label>
              <Slider
                defaultValue={[layout.columns]}
                max={6}
                min={2}
                step={1}
                onValueChange={([value]) => setLayout(prev => ({ ...prev, columns: value }))}
              />
            </div>

            <div className="space-y-2">
              <label className={`${theme.text} text-sm`}>Grid Gap</label>
              <Slider
                defaultValue={[layout.gap]}
                max={8}
                min={0}
                step={1}
                onValueChange={([value]) => setLayout(prev => ({ ...prev, gap: value }))}
              />
            </div>
          </div>

          {/* Theme Controls */}
          <div className={`${theme.secondary} p-4 rounded-lg space-y-4`}>
            <h3 className={`${theme.text} font-bold flex items-center gap-2`}>
              <PaintBucket className="w-4 h-4" /> Theme Customization
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(THEMES).map(([themeName, themeColors]) => (
                <button
                  key={themeName}
                  onClick={() => setTheme(themeColors)}
                  className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80 transition-opacity`}
                >
                  <div className={`h-8 rounded ${themeColors.primary}`} />
                  <p className={`${theme.text} text-sm mt-2`}>{themeName}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`min-h-screen ${theme.primary} p-6`}>
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
            gap: `${layout.gap * 0.25}rem`,
          }}
          className="w-full max-w-7xl mx-auto"
        >
          {/* Equipment Panel */}
          <DraggablePanel id="equipment">
            <div className={`${theme.secondary} rounded-lg border ${theme.accent} flex flex-col`}>
              <h2 className={`${theme.text} text-lg font-bold p-4 flex items-center gap-2 border-b ${theme.accent}`}>
                <User className="w-5 h-5" /> Equipment
              </h2>
              <div className="flex-1 p-4 space-y-2">
                {['Head', 'Chest', 'Legs', 'Feet', 'Weapon', 'Shield'].map((slot) => (
                  <div
                    key={slot}
                    className={`${theme.primary} rounded p-2 flex items-center gap-2 ${theme.text}`}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </DraggablePanel>

          {/* Main Inventory */}
          <DraggablePanel id="inventory" style={{ gridColumn: 'span 2' }}>
            <div className={`${theme.secondary} rounded-lg border ${theme.accent} flex flex-col`}>
              <h2 className={`${theme.text} text-lg font-bold p-4 flex items-center gap-2 border-b ${theme.accent}`}>
                <Package className="w-5 h-5" /> Inventory
              </h2>
              <div className="flex-1 p-4">
                <div className="grid grid-cols-5 gap-2">
                  {inventory.map((_, i) => (
                    <div
                      key={i}
                      className={`${theme.primary} rounded aspect-square`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DraggablePanel>

          {/* Quick Access */}
          <DraggablePanel id="quickAccess">
            <div className={`${theme.secondary} rounded-lg border ${theme.accent} flex flex-col`}>
              <h2 className={`${theme.text} text-lg font-bold p-4 flex items-center gap-2 border-b ${theme.accent}`}>
                <Zap className="w-5 h-5" /> Quick Access
              </h2>
              <div className="flex-1 p-4">
                <div className="grid grid-cols-4 gap-2">
                  {quickSlots.map((_, i) => (
                    <div
                      key={i}
                      className={`${theme.primary} rounded aspect-square`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </DraggablePanel>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className={`fixed bottom-6 right-6 p-4 ${theme.secondary} rounded-full hover:opacity-80 transition-opacity`}
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Settings Modal */}
        <SettingsModal 
          show={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </DndProvider>
  );
};

export default InventorySystem;