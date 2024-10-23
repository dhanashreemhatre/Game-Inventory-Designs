import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings, X, User, Trash2, ArrowLeft } from 'lucide-react';

const ItemTypes = {
  INVENTORY_ITEM: 'inventoryItem',
  QUICKSLOT_ITEM: 'quickslotItem'
};

const defaultThemes = {
  red: {
    primary: 'bg-red-900/40',
    secondary: 'bg-red-800/30',
    accent: 'border-red-500',
    text: 'text-red-100',
    hover: 'hover:bg-red-700/40'
  },
  blue: {
    primary: 'bg-blue-900/40',
    secondary: 'bg-blue-800/30',
    accent: 'border-blue-500',
    text: 'text-blue-100',
    hover: 'hover:bg-blue-700/40'
  },
  green: {
    primary: 'bg-emerald-900/40',
    secondary: 'bg-emerald-800/30',
    accent: 'border-emerald-500',
    text: 'text-emerald-100',
    hover: 'hover:bg-emerald-700/40'
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

export default function AestheticInventory() {
  const [activeTheme, setActiveTheme] = useState('red');
  const [showSettings, setShowSettings] = useState(false);
  const [inventory, setInventory] = useState(initialInventory);
  const [quickSlots, setQuickSlots] = useState(Array(4).fill(null));
  const [showItemMenu, setShowItemMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [giveAmount, setGiveAmount] = useState(1);
  const [playerId, setPlayerId] = useState('');
  
  const theme = defaultThemes[activeTheme];

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

  const moveToQuickSlot = (item, slotIndex) => {
    // Remove item from inventory
    setInventory(inventory.filter(inv => inv.id !== item.id));
    
    // If there's an item in the quickslot, move it back to inventory
    const currentItem = quickSlots[slotIndex];
    if (currentItem) {
      const existingItem = inventory.find(inv => inv.id === currentItem.id);
      if (existingItem) {
        setInventory(inventory.map(inv =>
          inv.id === currentItem.id 
            ? { ...inv, quantity: inv.quantity + currentItem.quantity }
            : inv
        ));
      } else {
        setInventory(prev => [...prev, currentItem]);
      }
    }
    
    // Update quickslot
    const updatedQuickSlots = [...quickSlots];
    updatedQuickSlots[slotIndex] = item;
    setQuickSlots(updatedQuickSlots);
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
          <div className={`${theme.primary} rounded-lg p-6 border border-gray-800`}>
            <div className="relative aspect-[3/4] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="w-48 h-72 bg-gray-900/50 rounded-full"></div>
                </div>
              </div>
              
              <div className="absolute inset-0 grid grid-cols-3 gap-4 p-4">
                <EquipmentSlot position="top-0 left-1/2 -translate-x-1/2" theme={theme} label="Hat" />
                <EquipmentSlot position="top-1/4 left-0" theme={theme} label="Watch" />
                <EquipmentSlot position="top-1/4 right-0" theme={theme} label="Armor" />
                <EquipmentSlot position="top-1/2 left-0" theme={theme} label="Shirt" />
                <EquipmentSlot position="top-1/2 right-0" theme={theme} label="Weapon" />
                <EquipmentSlot position="bottom-1/4 left-1/2 -translate-x-1/2" theme={theme} label="Pants" />
                <EquipmentSlot position="bottom-0 left-1/2 -translate-x-1/2" theme={theme} label="Shoes" />
              </div>
            </div>
          </div>

          {/* Quick Slots Section */}
          <div className={`${theme.primary} rounded-lg p-6 border border-gray-800`}>
            <h2 className={`${theme.text} text-xl font-bold mb-4`}>Quick Access</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickSlots.map((item, index) => (
                <QuickSlot 
                  key={index} 
                  item={item} 
                  theme={theme} 
                  index={index}
                  onClick={(e) => item && handleItemClick(e, item, index)}
                  onAction={handleItemAction}
                  onDrop={(item) => moveToQuickSlot(item, index)}
                />
              ))}
            </div>
          </div>

          {/* Inventory Grid Section */}
          <div className={`${theme.primary} rounded-lg p-6 border border-gray-800`}>
            <h2 className={`${theme.text} text-xl font-bold mb-4`}>Inventory</h2>
            <div className="grid grid-cols-4 gap-3">
              {inventory.map((item, index) => (
                <InventoryItem 
                  key={index} 
                  item={item} 
                  theme={theme}
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
                <EmptySlot key={`empty-${index}`} theme={theme} />
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

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className={`${theme.primary} rounded-lg p-6 max-w-md w-full`}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Theme Settings</h2>
                <button onClick={() => setShowSettings(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4">
                {Object.keys(defaultThemes).map((themeName) => (
                  <button
                    key={themeName}
                    onClick={() => setActiveTheme(themeName)}
                    className={`w-full p-3 rounded-lg ${defaultThemes[themeName].primary} 
                      ${activeTheme === themeName ? 'ring-2 ring-white' : ''}`}
                  >
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Item Action Menu */}
        {showItemMenu && (
  <div 
    className="fixed inset-0 bg-black/80 z-50"
    onClick={() => setShowItemMenu(null)}
  >
    <div 
      className={`${theme.primary} rounded-lg p-4 w-64 absolute`}
      onClick={e => e.stopPropagation()}
      style={{
        left: `${Math.min(menuPosition.x, window.innerWidth - 280)}px`,
        top: `${Math.min(menuPosition.y, window.innerHeight - 300)}px`
      }}
    >
      <button
        onClick={() => handleItemAction('use', showItemMenu.item, showItemMenu.slotIndex)}
        className={`w-full p-2 mb-2 ${theme.secondary} rounded flex items-center gap-2 hover:bg-gray-700/40`}
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
          className={`w-full p-2 ${theme.secondary} rounded flex items-center justify-center gap-2 hover:bg-gray-700/40`}
        >
          <User className="w-4 h-4" /> Give Item
        </button>
      </div>

      {showItemMenu.slotIndex !== null && (
        <button
          onClick={() => handleItemAction('returnToInventory', showItemMenu.item, showItemMenu.slotIndex)}
          className={`w-full p-2 ${theme.secondary} rounded flex items-center gap-2 hover:bg-gray-700/40`}
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
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

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
    drop: (droppedItem) => onDrop(droppedItem),
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

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

const EquipmentSlot = ({ position, theme, label }) => (
  <div className={`absolute ${position}`}>
    <div className={`${theme.secondary} ${theme.hover} w-12 h-12 rounded-lg border ${theme.accent}
      flex items-center justify-center transition-colors duration-200`}>
      <span className="text-xs text-center">{label}</span>
    </div>
  </div>
);

const EmptySlot = ({ theme }) => (
  <div className={`${theme.secondary} ${theme.hover} aspect-square rounded-lg border ${theme.accent}
    flex items-center justify-center transition-colors duration-200`}>
    <span className="text-gray-500 text-sm">Empty</span>
  </div>
);
