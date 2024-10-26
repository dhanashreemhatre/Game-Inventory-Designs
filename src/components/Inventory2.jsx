import React, { useState,useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings, X, User, Trash2, ArrowLeft, Layout, Palette,Box,Zap,Package } from 'lucide-react';
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

const equipmentImages = {
  hat: hat,
  watch: watch,
  armor:rifle,
  shirt: shirt,
  weapon: rifle,
  pants: trousers,
  shoes:sport_shoe
};

const defaultThemes = {
  Default: {
    primary: 'bg-gray-900',
    secondary: 'bg-gray-800',
    accent: 'border-emerald-700 bg-emerald-700/10 shadow-md shadow-emerald-500/50 rounded-md',
    text: 'text-gray-100',
    hover: 'hover:border-emerald-200/40 hover:shadow-md hover:shadow-emerald-500/50'
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

const layoutPresets = {
  standard: {
    container: 'h-screen w-screen fixed inset-0 p-8 bg-black/95',
    gridLayout: 'grid grid-cols-[100px_600px_250px] gap-4 h-[75vh] max-w-[1800px] flex justify-around', // reduced from 200px to 120px
    inventoryGrid: 'grid-cols-5 gap-3',
    quickSlotsGrid: 'grid-cols-2 gap-3',
    groundItemsGrid: 'grid-cols-8 gap-3'
  },
  compact: {
    container: 'h-screen w-screen fixed inset-0 p-4 bg-black/95',
    gridLayout: 'grid grid-cols-[100px_560px_200px] gap-4 h-[75vh] max-w-[1600px] flex justify-around', // reduced from 180px to 100px
    inventoryGrid: 'grid-cols-5 gap-2',
    quickSlotsGrid: 'grid-cols-2 gap-2',
    groundItemsGrid: 'grid-cols-8 gap-3'
  },
  widescreen: {
    container: 'h-screen w-screen fixed inset-0 p-8 bg-black/95',
    gridLayout: 'grid grid-cols-[100px_1fr_200px] gap-10 h-[75vh] h-full max-w-[2000px] mx-auto', // reduced from 220px to 140px
    inventoryGrid: 'grid-cols-8 gap-4',
    quickSlotsGrid: 'grid-cols-2 gap-4',
    groundItemsGrid: 'grid-cols-10 gap-4'
  }
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
    return savedTheme ? JSON.parse(savedTheme) : defaultThemes.Default;
  });
  
  // const [layout, setLayout] = useState(() => {
  //   const savedLayout = localStorage.getItem('customLayout');
  //   return savedLayout ? JSON.parse(savedLayout) : defaultLayout;
  // });
  const [activeLayout, setActiveLayout] = useState('standard');

  const currentLayout = layoutPresets[activeLayout];

  
  const [settingsTab, setSettingsTab] = useState('theme');

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('quickSlots', JSON.stringify(quickSlots));
  }, [inventory, quickSlots]);

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

  // Add this to your initialState
const initialGroundItems = [
  { id: 'g1', name: "Dropped Health Pack", icon: "🧰", quantity: 1 },
  { id: 'g2', name: "Abandoned Ammo", icon: "🎯", quantity: 50 },
  { id: 'g3', name: "Lost Key", icon: "🔑", quantity: 1 }
];

// Add this state to your component
const [groundItems, setGroundItems] = useState(initialGroundItems);

// Add this function to handle picking up items
const handlePickupItem = (item, index) => {
  const existingItem = inventory.find(inv => inv.id === item.id);
  if (existingItem) {
    setInventory(inventory.map(inv =>
      inv.id === item.id 
        ? { ...inv, quantity: inv.quantity + item.quantity }
        : inv
    ));
  } else {
    setInventory([...inventory, item]);
  }
  setGroundItems(groundItems.filter((_, i) => i !== index));
};

  return (
    <DndProvider backend={HTML5Backend}>
        <div className={currentLayout.container}>
        <div className={currentLayout.gridLayout}>
     {/* Character Equipment Panel */}
     <div className={`rounded-lg flex flex-col`}>
          <h2 className={`${activeTheme.text} text-md font-bold p-4 flex justify-center items-center gap-2`}>
            <div className={`border p-2 ${activeTheme.accent}`}><User className="w-5 h-5" /></div> User
          </h2>
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {['Hat', 'Watch', 'Armor', 'Shirt', 'Weapon', 'Pants', 'Shoes'].map((slot) => (
              <EquipmentSlot
                key={slot}
                theme={activeTheme}
                image={equipmentImages[slot.toLowerCase()]}
                label={slot}
              />
            ))}
          </div>
        </div>
         {/* Main Inventory */}
         <div className={`rounded-lg flex flex-col`}>
          <h2 className={`${activeTheme.text} text-lg font-bold p-4 flex items-center gap-2`}>
          <div className={`border p-2 ${activeTheme.accent}`}> <Package className="w-5 h-5" /> </div>Inventory
          </h2>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className={`grid ${currentLayout.inventoryGrid}`}>
              {inventory.map((item, index) => (
                <InventoryItem 
                  key={index}
                  item={item}
                  theme={activeTheme}
                  onClick={(e) => handleItemClick(e, item)}
                />
              ))}
              {Array.from({ length: Math.max(0, 20 - inventory.length) }).map((_, index) => (
                <EmptySlot key={`empty-${index}`} theme={activeTheme} />
              ))}
            </div>
          </div>
        </div>

          {/* Quick Slots Panel */}
        <div className={`rounded-lg flex flex-col`}>
          <h2 className={`${activeTheme.text} text-lg font-bold p-4 flex items-center gap-2`}>
          <div className={`border p-2 ${activeTheme.accent}`}> <Zap className="w-5 h-5" /></div> Quick Access
          </h2>
          <div className="flex-1 p-4">
            <div className={`grid ${currentLayout.quickSlotsGrid}`}>
              {quickSlots.map((item, index) => (
                <QuickSlot
                  key={index}
                  item={item}
                  theme={activeTheme}
                  index={index}
                  onClick={(e) => item && handleItemClick(e, item, index)}
                  onDrop={(item) => moveToQuickSlot(item, index)}
                />
              ))}
            </div>
          </div>
        </div>


            {/* Ground Items Panel - Updated to be more compact */}
            
          <div className={`col-span-2 rounded-lg flex flex-col`}>
           
            <div className="flex-1 p-2 overflow-x-auto">
              <div className={`grid ${currentLayout.groundItemsGrid}`}>
                {groundItems.map((item, index) => (
                  <GroundItem
                    key={index}
                    item={item}
                    theme={activeTheme}
                    onPickup={() => handlePickupItem(item, index)}
                  />
                ))}
              </div>
            </div>
          </div>
        
        </div>


      {/* Settings Button */}
      <button 
          onClick={() => setShowSettings(true)}
          className="fixed bottom-6 right-6 p-4 bg-gray-800/90 rounded-full hover:bg-gray-700 transition-colors"
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
            layout={activeLayout}
            onLayoutChange={setActiveLayout} // Pass the layout setter function
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
        className={`w-full p-2 mb-2 ${activeTheme.secondary} ${activeTheme.hover} rounded flex items-center gap-2 hover:bg-gray-700/40`}
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
          className={`w-full p-2 ${activeTheme.secondary} ${activeTheme.hover} rounded flex items-center justify-center gap-2 hover:bg-gray-700/40`}
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
const InventoryItem = ({ item, theme, onClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INVENTORY_ITEM,
    item: () => ({ ...item }),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }), [item]);

  return (
    <div
      ref={drag}
      className={`${theme.secondary} aspect-square rounded ${theme.hover}
        p-2 flex flex-col items-center justify-center cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <span className="text-xl mb-0.5">{item.icon}</span>
      <span className="text-xs text-center truncate w-full">{item.name}</span>
      <span className="text-xs text-gray-400">x{item.quantity}</span>
    </div>
  );
};

// Updated quick slot component
const QuickSlot = ({ item, theme, index, onClick, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (droppedItem) => {
      onDrop(droppedItem);
      return { dropped: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }), [onDrop]);

  return (
    <div
      ref={drop}
      className={`${theme.secondary} ${theme.hover} aspect-square rounded
        p-2 flex flex-col items-center justify-center relative transition-all duration-200
        ${isOver ? 'border-2 border-white' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-1 left-1 text-xs bg-black/50 px-1.5 py-0.5 rounded">
        {index + 1}
      </div>
      {item ? (
        <>
          <span className="text-xl mb-0.5">{item.icon}</span>
          <span className="text-xs text-center truncate w-full">{item.name}</span>
          <span className="text-xs text-gray-400">x{item.quantity}</span>
        </>
      ) : (
        <span className="text-gray-500 text-xs">Empty</span>
      )}
    </div>
  );
};

// More compact equipment slot
const EquipmentSlot = ({ theme, image, label }) => (
  <div className="flex items-center gap-2 p-1">
    <div className={`
      ${theme.secondary} 
      ${theme.hover} 
      w-12 
      h-12 
      rounded  
      flex 
      items-center 
      justify-center 
      transition-colors 
      duration-200
    `}>
      <img 
        src={image} 
        alt={label} 
        className="w-10 h-10 object-contain" 
      />
    </div>
  </div>
);

// More compact ground item
const GroundItem = ({ item, theme, onPickup }) => (
  <div
    className={`${theme.secondary} ${theme.hover} aspect-square rounded
      p-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-200`}
    onClick={onPickup}
  >
    <span className="text-lg mb-0.5">{item.icon}</span>
    <span className="text-xs text-center truncate w-full">{item.name}</span>
    <span className="text-xs text-gray-400">x{item.quantity}</span>
  </div>
);


const EmptySlot = ({ theme }) => (
  <div className={`${theme.secondary} ${theme.hover} aspect-square rounded-lg
    flex items-center justify-center transition-colors duration-200`}>
    <span className="text-gray-500 text-sm">Empty</span>
  </div>
);
