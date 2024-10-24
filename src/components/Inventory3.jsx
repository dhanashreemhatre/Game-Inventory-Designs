import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings, X, User, Trash2, ArrowLeft, Layout, Palette } from 'lucide-react';
import EnhancedSettingsModal from './Setting'
import {
  hat,
  shirt,
  rifle,
  sport_shoe,
  trousers,
  watch,
} from "./images/images";

const ItemTypes = {
  INVENTORY_ITEM: 'inventoryItem',
  QUICKSLOT_ITEM: 'quickslotItem'
};

const defaultThemes = {
  red: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-red-800/40',         // Dark red with transparency
    accent: 'border-red-500',           // Red accent for borders
    text: 'text-red-200',               // Lighter red text for contrast
    hover: 'hover:bg-red-600/40'        // Red hover effect with transparency
  },
  blue: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-blue-800/40',        // Dark blue with transparency
    accent: 'border-blue-500',          // Blue accent for borders
    text: 'text-blue-200',              // Light blue text for contrast
    hover: 'hover:bg-blue-600/40'       // Blue hover effect with transparency
  },
  green: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-emerald-800/40',     // Dark green with transparency
    accent: 'border-emerald-500',       // Emerald accent for borders
    text: 'text-emerald-200',           // Light green text for contrast
    hover: 'hover:bg-emerald-600/40'    // Emerald hover effect with transparency
  },
  pink: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-pink-800/40',        // Dark pink with transparency
    accent: 'border-pink-500',          // Pink accent for borders
    text: 'text-pink-200',              // Light pink text for contrast
    hover: 'hover:bg-pink-600/40'       // Pink hover effect with transparency
  },
  purple: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-purple-800/40',      // Dark purple with transparency
    accent: 'border-purple-500',        // Purple accent for borders
    text: 'text-purple-200',            // Light purple text for contrast
    hover: 'hover:bg-purple-600/40'     // Purple hover effect with transparency
  },
  blackGold: {
    primary: 'bg-black-900',            // Deep black background
    secondary: 'bg-gray-800/50',        // Dark gray with transparency
    accent: 'border-yellow-400',        // Gold accent for borders
    text: 'text-yellow-200',            // Light gold text for contrast
    hover: 'hover:bg-yellow-600/40'     // Gold hover effect with transparency
  },
  whiteBlue: { // New white and blue theme
    primary: 'bg-white/80',
    secondary: 'bg-blue-400/60',
    accent: 'border-blue-300',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-500/60'
  }
};


const initialInventory = [
  { id: 1, name: "Health Pack", icon: "🧰", quantity: 5 },
  { id: 2, name: "MP5", icon: "🔫", quantity: 1 },
  { id: 3, name: "Ammo", icon: "🎯", quantity: 100 },
  { id: 4, name: "Grenade", icon: "💣", quantity: 3 },
  { id: 5, name: "Bandage", icon: "🩹", quantity: 10 },
  { id: 6, name: "Water", icon: "💧", quantity: 2 },
  { id: 7, name: "Food", icon: "🍖", quantity: 4 },
  { id: 8, name: "Key", icon: "🔑", quantity: 1 }
];

const defaultLayout = {
  character: { gridColumn: '1', gridRow: '1' },
  quickSlots: { gridColumn: '2', gridRow: '1' },
  inventory: { gridColumn: '3', gridRow: '1' }
};


export default function AestheticInventory() {
  const [showSettings, setShowSettings] = useState(false);
  const [inventory, setInventory] = useState(initialInventory);
  const [quickSlots, setQuickSlots] = useState(Array(4).fill(null));
  const [showItemMenu, setShowItemMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [giveAmount, setGiveAmount] = useState(1);
  const [playerId, setPlayerId] = useState('');

  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem('customTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultThemes.blackGold;
  });
  
  const [layout, setLayout] = useState(() => {
    const savedLayout = localStorage.getItem('customLayout');
    return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
  });
  
  const [settingsTab, setSettingsTab] = useState('theme');

  const handleItemAction = (action, item, slotIndex = null) => {
    switch (action) {
      case 'use':
        if (item.quantity > 1) {
          const updatedInventory = inventory.map(inv => 
            inv.id === item.id ? { ...inv, quantity: inv.quantity - 1 } : inv
          );
          setInventory(updatedInventory);
          if (slotIndex !== null) {
            const updatedQuickSlots = [...quickSlots];
            updatedQuickSlots[slotIndex] = { ...item, quantity: item.quantity - 1 };
            setQuickSlots(updatedQuickSlots);
          }
        } else {
          if (slotIndex !== null) {
            const updatedQuickSlots = [...quickSlots];
            updatedQuickSlots[slotIndex] = null;
            setQuickSlots(updatedQuickSlots);
          }
          setInventory(inventory.filter(inv => inv.id !== item.id));
        }
        break;
      case 'give':
        const amountToGive = Math.min(giveAmount, item.quantity);
        if (amountToGive > 0) {
          if (item.quantity > amountToGive) {
            const updatedInventory = inventory.map(inv => 
              inv.id === item.id ? { ...inv, quantity: inv.quantity - amountToGive } : inv
            );
            setInventory(updatedInventory);
            
            if (slotIndex !== null) {
              const updatedQuickSlots = [...quickSlots];
              updatedQuickSlots[slotIndex] = { ...item, quantity: item.quantity - amountToGive };
              setQuickSlots(updatedQuickSlots);
            }
          } else {
            if (slotIndex !== null) {
              const updatedQuickSlots = [...quickSlots];
              updatedQuickSlots[slotIndex] = null;
              setQuickSlots(updatedQuickSlots);
            }
            setInventory(inventory.filter(inv => inv.id !== item.id));
          }
          // Here you would typically implement the actual giving functionality
          console.log(`Gave ${amountToGive} ${item.name}(s) to player ${playerId}`);
        }
        break;
      case 'returnToInventory':
        if (slotIndex !== null) {
          const itemToReturn = quickSlots[slotIndex];
          if (itemToReturn) {
            const existingItem = inventory.find(inv => inv.id === itemToReturn.id);
            if (existingItem) {
              setInventory(inventory.map(inv =>
                inv.id === itemToReturn.id 
                  ? { ...inv, quantity: inv.quantity + itemToReturn.quantity }
                  : inv
              ));
            } else {
              setInventory([...inventory, itemToReturn]);
            }
            const updatedQuickSlots = [...quickSlots];
            updatedQuickSlots[slotIndex] = null;
            setQuickSlots(updatedQuickSlots);
          }
        }
        break;
      default:
        break;
    }
    setShowItemMenu(null);
    setGiveAmount(1);
    setPlayerId('');
  };

  const moveToQuickSlot = (draggedItem, targetSlotIndex) => {
    setInventory(prevInventory => {
      setQuickSlots(prevQuickSlots => {
        const newQuickSlots = [...prevQuickSlots];
        const currentSlotItem = newQuickSlots[targetSlotIndex];
        
        // Handle the item currently in the quickslot (if any)
        if (currentSlotItem) {
          const existingItemIndex = prevInventory.findIndex(item => item.id === currentSlotItem.id);
          if (existingItemIndex !== -1) {
            // Update existing item quantity
            const updatedInventory = [...prevInventory];
            updatedInventory[existingItemIndex] = {
              ...updatedInventory[existingItemIndex],
              quantity: updatedInventory[existingItemIndex].quantity + currentSlotItem.quantity
            };
            prevInventory = updatedInventory;
          } else {
            // Add item back to inventory
            prevInventory = [...prevInventory, { ...currentSlotItem }];
          }
        }
        
        // Place dragged item in quickslot
        newQuickSlots[targetSlotIndex] = { ...draggedItem };
        
        return newQuickSlots;
      });
      
      // Remove dragged item from inventory
      return prevInventory.filter(item => item.id !== draggedItem.id);
    });
  };

  const handleItemClick = (e, item, slotIndex = null) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setShowItemMenu({ item, slotIndex });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-black/95 text-white p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Character Equipment Section */}
          <div style={layout.character} className={`${activeTheme.primary} rounded-lg p-6 border border-gray-800`}>
            <div className="relative aspect-[3/4] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-48 h-72 bg-gray-900/50 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4">
                <EquipmentSlot position="top-0 left-1/2 -translate-x-1/2" theme={activeTheme} image={hat} label="Hat" />
                <EquipmentSlot position="top-1/4 left-0" theme={activeTheme} image={watch} label="Watch" />
                <EquipmentSlot position="top-1/4 right-0" theme={activeTheme} image={rifle} label="Armor" />
                <EquipmentSlot position="top-1/2 left-0" theme={activeTheme} image={shirt} label="Shirt" />
                <EquipmentSlot position="top-1/2 right-0" theme={activeTheme} image={rifle} label="Weapon" />
                <EquipmentSlot position="bottom-1/4 left-1/2 -translate-x-1/2" theme={activeTheme} image={trousers} label="Pants" />
                <EquipmentSlot position="bottom-0 left-1/2 -translate-x-1/2" theme={activeTheme} image={sport_shoe} label="Shoes" />
              </div>
            </div>
          </div>

          {/* Quick Slots Section */}
          <div style={layout.quickSlots} className={`${activeTheme.primary} rounded-lg p-6 border border-gray-800`}>
            <h2 className={`${activeTheme.text} text-xl font-bold mb-4`}>Quick Access</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickSlots.map((item, index) => (
                <QuickSlot 
                  key={index} 
                  item={item} 
                  theme={activeTheme} 
                  index={index}
                  onClick={(e) => item && handleItemClick(e, item, index)}
                  onAction={handleItemAction}
                  onDrop={(item) => moveToQuickSlot(item, index)}
                />
              ))}
            </div>
          </div>

          {/* Inventory Grid Section */}
          <div style={layout.inventory} className={`${activeTheme.primary} rounded-lg p-6 border border-gray-800`}>
            <h2 className={`${activeTheme.text} text-xl font-bold mb-4`}>Inventory</h2>
            <div className="grid grid-cols-4 gap-3">
              {inventory.map((item, index) => (
                <InventoryItem 
                  key={index} 
                  item={item} 
                  theme={activeTheme}
                  onClick={(e) => handleItemClick(e, item)}
                  onDoubleClick={() => {
                    const emptySlot = quickSlots.findIndex(slot => !slot);
                    if (emptySlot !== -1) {
                      moveToQuickSlot(item, emptySlot);
                    }
                  }}
                />
              ))}
              {Array.from({ length: Math.max(0, 16 - inventory.length) }).map((_, index) => (
                <EmptySlot key={`empty-${index}`} theme={activeTheme} />
              ))}
            </div>
          </div>
        </div>

      {/* Settings Button */}
        <button 
          onClick={() => setShowSettings(true)}
          className="fixed bottom-4 right-4 p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Enhanced Settings Modal */}
        {showSettings && (
          <EnhancedSettingsModal 
            show={showSettings} 
            onClose={() => setShowSettings(false)} // Pass the function to close the modal
            theme={activeTheme}
            onThemeChange={setActiveTheme} // Pass the state setter function
            layout={layout}
            onLayoutChange={setLayout} // Pass the layout setter function
          />
        )}
        {/* Item Action Menu */}
        {showItemMenu && (
  <div 
    className="fixed inset-0 bg-black/80 z-50"
    onClick={() => setShowItemMenu(null)}
  >
    <div 
      className={`${activeTheme.primary} rounded-lg p-4 w-64 absolute`}
      onClick={e => e.stopPropagation()}
      style={{
        left: `${Math.min(menuPosition.x, window.innerWidth - 280)}px`,
        top: `${Math.min(menuPosition.y, window.innerHeight - 300)}px`
      }}
    >
      <button
        onClick={() => handleItemAction('use', showItemMenu.item, showItemMenu.slotIndex)}
        className={`w-full p-2 mb-2 ${activeTheme.secondary} rounded flex items-center gap-2 hover:bg-gray-700/40`}
      >
        <Trash2 className="w-4 h-4" /> Use Item
      </button>
      
      <div className="space-y-2 mb-2">
        <input
          type="text"
          placeholder="Player ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          className="w-full p-2 rounded bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-gray-500"
        />
        <input
          type="number"
          min="1"
          max={showItemMenu.item.quantity}
          value={giveAmount}
          onChange={(e) => setGiveAmount(parseInt(e.target.value) || 1)}
          className="w-full p-2 rounded bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={() => handleItemAction('give', showItemMenu.item, showItemMenu.slotIndex)}
          className={`w-full p-2 ${activeTheme.secondary} rounded flex items-center justify-center gap-2 hover:bg-gray-700/40`}
        >
          <User className="w-4 h-4" /> Give Item
        </button>
      </div>

      {showItemMenu.slotIndex !== null && (
        <button
          onClick={() => handleItemAction('returnToInventory', showItemMenu.item, showItemMenu.slotIndex)}
          className={`w-full p-2 ${activeTheme.secondary} rounded flex items-center gap-2 hover:bg-gray-700/40`}
        >
          <ArrowLeft className="w-4 h-4" /> Return to Inventory
        </button>
      )}
    </div>
  </div>
)}
         </div>
    </DndProvider>
  );
}
const InventoryItem = ({ item, theme, onDoubleClick, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INVENTORY_ITEM,
    item: () => ({ ...item }), // Create a fresh copy for each drag operation
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [item]); // Add dependency array to recreate drag source when item changes

  return (
    <div
      ref={drag}
      className={`${theme.secondary} ${theme.hover} aspect-square rounded-lg border ${theme.accent}
        p-4 flex flex-col items-center justify-center cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onDoubleClick={onDoubleClick}
      onClick={onClick}
    >
      <span className="text-2xl mb-1">{item.icon}</span>
      <span className="text-xs text-center">{item.name}</span>
      <span className="text-xs text-gray-400">x{item.quantity}</span>
    </div>
  );
};

const QuickSlot = ({ item, theme, index, onClick, onAction, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (droppedItem) => {
      onDrop(droppedItem);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [onDrop]); // Add dependency array to recreate drop target when onDrop changes

  return (
    <div
      ref={drop}
      className={`${theme.secondary} ${theme.hover} aspect-square rounded-lg border ${theme.accent}
        p-4 flex flex-col items-center justify-center relative transition-all duration-200
        ${isOver ? 'border-2 border-white' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
        {index + 1}
      </div>
      {item ? (
        <>
          <span className="text-2xl mb-1">{item.icon}</span>
          <span className="text-xs text-center">{item.name}</span>
          <span className="text-xs text-gray-400">x{item.quantity}</span>
        </>
      ) : (
        <span className="text-gray-500 text-sm">Empty</span>
      )}
    </div>
  );
};

// Updated moveToQuickSlot function with improved state management

const EquipmentSlot = ({ position, theme, image, label }) => (
  <div className={`absolute ${position}`}>
    <div className={`${theme.secondary} ${theme.hover} w-12 h-12 rounded-lg border ${theme.accent}
      flex items-center justify-center transition-colors duration-200`}>
      <img src={image} alt={label} className="w-10 h-10 object-contain" /> {/* Image display */}
    </div>
  </div>
);

const EmptySlot = ({ theme }) => (
  <div className={`${theme.secondary} ${theme.hover} aspect-square rounded-lg border ${theme.accent}
    flex items-center justify-center transition-colors duration-200`}>
    <span className="text-gray-500 text-sm">Empty</span>
  </div>
);
