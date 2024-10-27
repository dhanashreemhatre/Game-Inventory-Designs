import React, { useState,useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Settings, X, User, Trash2, ArrowLeft, Layout, Palette,Box,Zap,Package } from 'lucide-react';
import EnhancedSettingsModal from './Setting'
import ItemMenu from './ui/ItemMenu';
import EquipmentSlot from './slots/EquipmentSlots';
import QuickSlot from './slots/QuickSlot';
import EmptySlot from './slots/EmptySlot';
import InventoryItem from './slots/InventoryItem';
import GroundItems from './slots/GroundItems';
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
  QUICKSLOT_ITEM: 'quickslotItem',
  GROUND_ITEM: 'groundItem'
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
  { id: 8, name: "Key", icon: "🔑", quantity: 1 },

];

const layoutPresets = {
  standard: {
    container: 'h-screen w-screen fixed inset-0 p-6 bg-black/95',
    gridLayout: 'grid grid-cols-[100px_600px_250px] g-2 md:gap-4 h-[60vh] flex justify-around', // reduced from 200px to 120px
    inventoryGrid: 'grid-cols-5 gap-3 overflow-auto max-h-[60vh]',
    quickSlotsGrid: 'grid-cols-2 gap-3 overflow-auto max-h-[60vh]',
    groundItemsGrid: 'col-start-3 col-span-2 grid grid-cols-6 gap-3',
    
  },
  cyberpunk: {
    container: 'h-screen w-screen fixed inset-0 p-4 bg-black/95',
    gridLayout: 'grid reverse grid-cols-[8rem_36rem_16rem] gap-4 h-3/4 max-w-7xl mx-auto flex justify-around', // reduced from 180px to 100px
    inventoryGrid: 'grid-cols-5 gap-2 overflow-auto max-h-[60vh]',
    quickSlotsGrid: 'grid-cols-2 gap-2 overflow-auto max-h-[60vh]',
    groundItemsGrid: 'grid-cols-6 gap-3 grid-center ',
    containerStyle: 'camo-pattern',  // Custom class for camo background
    slotStyle: 'border-2 border-stone-700'  // Thick borders for military look
  },
  futuristic: {
    container: 'h-screen w-screen fixed inset-0 p-8 bg-black/95',
    gridLayout: 'grid grid-cols-[100px_1fr_200px] gap-10 h-[75vh] h-full max-w-[2000px] mx-auto', // reduced from 220px to 140px
    inventoryGrid: 'grid-cols-8 gap-4 overflow-auto max-h-[60vh]',
    quickSlotsGrid: 'grid-cols-2 gap-4 overflow-auto max-h-[60vh]',
    groundItemsGrid: 'grid-cols-9 gap-4 md:mt-10',
    containerStyle: 'hologram-effect',  // Custom class for holographic effect
    slotStyle: 'hover:skew'  // Rounded corners and blur effect
  },
  medieval: {
    container: 'h-screen w-screen fixed inset-0 p-12 bg-black/95',
    gridLayout: 'grid grid-cols-[200px_600px_180px] mx-auto gap-8 h-[70vh] max-w-[1600px] flex justify-around',
    inventoryGrid: 'grid-cols-5 gap-6 overflow-auto max-h-[60vh]',
    quickSlotsGrid: 'grid-cols-2 gap-4 overflow-auto max-h-[60vh]',
    groundItemsGrid: 'grid-cols-6 gap-4'
  },
};

const initialGroundItems = [
  { id: 'g1', name: "Dropped Health Pack", icon: "🧰", quantity: 1 },
  { id: 'g2', name: "Abandoned Ammo", icon: "🎯", quantity: 50 },
  { id: 'g3', name: "Lost Key", icon: "🔑", quantity: 1 }
];

export default function AestheticInventory() {
  const getInitialInventoryState = () => {
    // Create an array of 20 null slots
    const emptyInventory = Array(20).fill(null);
    
    // Fill the first slots with initial items
    initialInventory.forEach((item, index) => {
      emptyInventory[index] = {
        ...item,
        id: item.id.toString() // Convert id to string for consistency
      };
    });
    
    return emptyInventory;
  };
  
  const [showSettings, setShowSettings] = useState(false);
  const [inventory, setInventory] = useState(getInitialInventoryState());
  const [quickSlots, setQuickSlots] = useState(Array(4).fill(null));
  const [showItemMenu, setShowItemMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const [activeTheme, setActiveTheme] = useState(() => {
    const savedTheme = localStorage.getItem('customTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultThemes.Default;
  });
  
  const [activeLayout, setActiveLayout] = useState('standard');

  const currentLayout = layoutPresets[activeLayout];

    // Add this to your initialState


// Add this state to your component
const [groundItems, setGroundItems] = useState(initialGroundItems);


  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('quickSlots', JSON.stringify(quickSlots));
  }, [inventory, quickSlots]);


// Updated handler functions
const moveToQuickSlot = (draggedItem, targetIndex) => {
  const sourceType = draggedItem.sourceType;
  const sourceIndex = draggedItem.sourceIndex;

  setInventory(prevInventory => {
    setQuickSlots(prevQuickSlots => {
      const newQuickSlots = [...prevQuickSlots];
      const targetItem = newQuickSlots[targetIndex];

      // Handle swap
      if (sourceType === 'quickslot') {
        // Moving within quickslots
        newQuickSlots[targetIndex] = draggedItem;
        newQuickSlots[sourceIndex] = targetItem;
      } else {
        // Moving from inventory to quickslot
        newQuickSlots[targetIndex] = draggedItem;
        if (targetItem) {
          return prevInventory.map((item, idx) => 
            idx === sourceIndex ? targetItem : item
          );
        }
      }
      
      return newQuickSlots;
    });

    if (sourceType === 'inventory') {
      return prevInventory.filter((_, idx) => idx !== sourceIndex);
    }
    return prevInventory;
  });
};


const handleInventoryDrop = (droppedItem, targetIndex) => {
  if (!droppedItem) return;

  // Get target slot item
  const targetItem = inventory[targetIndex];

  // Only handle inventory and quickslot sources
  if (droppedItem.sourceType === 'inventory') {
    // Moving within inventory
    setInventory(prev => {
      const newInventory = [...prev];
      const sourceItem = { ...newInventory[droppedItem.sourceIndex] };
      
      // If target has matching item, stack
      if (targetItem && targetItem.id === sourceItem.id) {
        newInventory[targetIndex] = {
          ...targetItem,
          quantity: targetItem.quantity + sourceItem.quantity
        };
        newInventory[droppedItem.sourceIndex] = null;
      } else {
        // Swap items
        newInventory[droppedItem.sourceIndex] = targetItem;
        newInventory[targetIndex] = sourceItem;
      }
      return newInventory;
    });
  } else if (droppedItem.sourceType === 'quickslot') {
    // Moving from quickslot to inventory
    if (targetItem && targetItem.id === droppedItem.id) {
      // Stack with existing item
      setInventory(prev => {
        const newInventory = [...prev];
        newInventory[targetIndex] = {
          ...targetItem,
          quantity: targetItem.quantity + droppedItem.quantity
        };
        return newInventory;
      });
    } else {
      // Swap items
      setInventory(prev => {
        const newInventory = [...prev];
        newInventory[targetIndex] = {
          ...droppedItem,
          sourceType: undefined,
          sourceIndex: undefined
        };
        return newInventory;
      });
    }
    
    setQuickSlots(prev => {
      const newQuickSlots = [...prev];
      newQuickSlots[droppedItem.sourceIndex] = targetItem;
      return newQuickSlots;
    });
  }
};


// Helper function to check if items can stack
const canItemsStack = (item1, item2) => {
  return item1 && item2 && item1.id === item2.id;
};

const handleDropToGround = (item) => {
  if (!item) return;

  const groundItem = {
    id: item.id,
    name: item.name,
    icon: item.icon,
    quantity: item.quantity
  };
  
  setGroundItems(prev => [...prev, groundItem]);

  // Clear item from source
  if (item.sourceType === 'inventory') {
    setInventory(prev => {
      const newInventory = [...prev];
      newInventory[item.sourceIndex] = null;
      return newInventory;
    });
  } else if (item.sourceType === 'quickslot') {
    setQuickSlots(prev => {
      const newQuickSlots = [...prev];
      newQuickSlots[item.sourceIndex] = null;
      return newQuickSlots;
    });
  }
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

  const handleQuickSlotDrop = (droppedItem, targetIndex) => {
    if (!droppedItem) return;
  
    if (droppedItem.sourceType === 'quickslot') {
      // Moving within quickslots
      setQuickSlots(prev => {
        const newQuickSlots = [...prev];
        const sourceItem = { ...newQuickSlots[droppedItem.sourceIndex] };
        if (sourceItem) {
          newQuickSlots[droppedItem.sourceIndex] = newQuickSlots[targetIndex];
          newQuickSlots[targetIndex] = sourceItem;
        }
        return newQuickSlots;
      });
    } else if (droppedItem.sourceType === 'inventory') {
      // Moving from inventory to quickslot
      setInventory(prev => {
        const newInventory = [...prev];
        newInventory[droppedItem.sourceIndex] = null;
        return newInventory;
      });
      
      setQuickSlots(prev => {
        const newQuickSlots = [...prev];
        const currentItem = newQuickSlots[targetIndex];
        newQuickSlots[targetIndex] = { ...droppedItem, sourceType: undefined, sourceIndex: undefined };
        
        // If there was an item in the target quickslot, move it to inventory
        if (currentItem) {
          setInventory(prev => {
            const newInventory = [...prev];
            const emptySlot = newInventory.findIndex(slot => slot === null);
            if (emptySlot !== -1) {
              newInventory[emptySlot] = currentItem;
            }
            return newInventory;
          });
        }
        
        return newQuickSlots;
      });
    }
  };


  const handlePickupItem = (item, index) => {
    if (!item) return;
  
    // First try to find matching item to stack with
    const existingItemIndex = inventory.findIndex(inv => inv && inv.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Stack with existing item
      setInventory(prev => prev.map((inv, idx) => 
        idx === existingItemIndex && inv
          ? { ...inv, quantity: inv.quantity + item.quantity }
          : inv
      ));
      
      // Remove from ground after successful stack
      setGroundItems(prev => prev.filter((_, i) => i !== index));
      return;
    }
  
    // If can't stack, find empty slot
    const emptySlotIndex = inventory.findIndex(slot => !slot);
    
    if (emptySlotIndex !== -1) {
      // Place in empty slot
      setInventory(prev => {
        const newInventory = [...prev];
        newInventory[emptySlotIndex] = { ...item };
        return newInventory;
      });
      
      // Remove from ground after successful placement
      setGroundItems(prev => prev.filter((_, i) => i !== index));
    } else {
      console.log('Inventory is full!');
      return;
    }
  };


  return (
    <DndProvider backend={HTML5Backend}>
        <div className={`${currentLayout.container} ${currentLayout.containerStyle}`}>
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
         <div className={`rounded-lg flex flex-col gap-6`}>
          {/* Main Inventory */}
         <div className={`rounded-lg flex flex-col`}>
          <h2 className={`${activeTheme.text} text-lg font-bold p-4 flex items-center gap-2`}>
          <div className={`border p-2 ${activeTheme.accent}`}> <Package className="w-5 h-5" /> </div>Inventory
          </h2>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className={`grid ${currentLayout.inventoryGrid}`}>
            {inventory.map((item, index) => (
            item ? (
              <InventoryItem 
              key={`inv-${index}`}
              item={item}
              theme={activeTheme}
              onClick={(e) => handleItemClick(e, item)}
              onDrop={(droppedItem) => handleInventoryDrop(droppedItem, index)}
              layout={currentLayout}
              handleDropToGround={handleDropToGround}
              index={index}
            />
            ) : (
              <EmptySlot
              key={`empty-inv-${index}`}
              theme={activeTheme}
              onDrop={(droppedItem) => handleInventoryDrop(droppedItem, index)}
              index={index}
              type="inventory"
            />
            )
          ))}
            </div>
          </div>
        </div>
          {/* Ground Items Panel - Updated to be more compact */}
            
          <div className={`col-span-2 rounded-lg flex flex-col`}>
           
  
              <div className={`grid ${currentLayout.groundItemsGrid}`}>
                  <GroundItems
                    items={groundItems}
                    theme={activeTheme}
                    handlePickupItem={handlePickupItem}
                  />
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
                  layout={currentLayout}
                  index={index}
                  onClick={(e) => item && handleItemClick(e, item, index)}
                  onDrop={(droppedItem) => handleQuickSlotDrop(droppedItem, index)}
                  handleDropToGround={handleDropToGround}
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
              <ItemMenu
                showItemMenu={showItemMenu}
                setShowItemMenu={setShowItemMenu}
                activeTheme={activeTheme}
                inventory={inventory}
                setInventory={setInventory}
                quickSlots={quickSlots}
                setQuickSlots={setQuickSlots}
                menuPosition={menuPosition}
              />
            )}

         </div>
    </DndProvider>
  );
}



