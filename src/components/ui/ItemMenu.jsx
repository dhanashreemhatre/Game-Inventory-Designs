import React, { useState, useEffect } from 'react';
import { Trash2, User, ArrowLeft } from 'lucide-react';

const ItemMenu = ({ 
  showItemMenu,
  setShowItemMenu,
  activeTheme,
  inventory,
  setInventory,
  quickSlots,
  setQuickSlots,
  menuPosition
}) => {
  const [playerId, setPlayerId] = useState('');
  const [giveAmount, setGiveAmount] = useState(1);

  // Reset give amount when menu opens with new item
  useEffect(() => {
    if (showItemMenu?.item) {
      setGiveAmount(1);
      setPlayerId('');
    }
  }, [showItemMenu]);

  // Guard clause - don't render if no menu data
  if (!showItemMenu || !showItemMenu.item) return null;

  const handleItemAction = (action, item, slotIndex = null) => {
    if (!item) return; // Guard against null items

    switch (action) {
      case 'use':
        handleUseItem(item, slotIndex);
        break;
      case 'give':
        handleGiveItem(item, slotIndex);
        break;
      case 'returnToInventory':
        handleReturnToInventory(slotIndex);
        break;
      default:
        break;
    }

    // Reset state after action
    setShowItemMenu(null);
    setGiveAmount(1);
    setPlayerId('');
  };

  const handleUseItem = (item, slotIndex) => {
    if (item.quantity > 1) {
      // Reduce quantity by 1
      setInventory(prev => 
        prev.map(inv => 
          inv?.id === item.id ? { ...inv, quantity: inv.quantity - 1 } : inv
        )
      );

      if (slotIndex !== null) {
        setQuickSlots(prev => {
          const updated = [...prev];
          if (updated[slotIndex]) {
            updated[slotIndex] = { ...item, quantity: item.quantity - 1 };
          }
          return updated;
        });
      }
    } else {
      // Remove item completely
      if (slotIndex !== null) {
        setQuickSlots(prev => {
          const updated = [...prev];
          updated[slotIndex] = null;
          return updated;
        });
      }
      setInventory(prev => prev.filter(inv => inv?.id !== item.id));
    }
  };

  const handleGiveItem = (item, slotIndex) => {
    const amountToGive = Math.min(giveAmount, item.quantity);
    if (amountToGive <= 0) return;

    if (item.quantity > amountToGive) {
      // Reduce quantity by given amount
      setInventory(prev => 
        prev.map(inv => 
          inv?.id === item.id ? { ...inv, quantity: inv.quantity - amountToGive } : inv
        )
      );
      
      if (slotIndex !== null) {
        setQuickSlots(prev => {
          const updated = [...prev];
          if (updated[slotIndex]) {
            updated[slotIndex] = { ...item, quantity: item.quantity - amountToGive };
          }
          return updated;
        });
      }
    } else {
      // Remove item completely
      if (slotIndex !== null) {
        setQuickSlots(prev => {
          const updated = [...prev];
          updated[slotIndex] = null;
          return updated;
        });
      }
      setInventory(prev => prev.filter(inv => inv?.id !== item.id));
    }
    
    console.log(`Gave ${amountToGive} ${item.name}(s) to player ${playerId}`);
  };

  const handleReturnToInventory = (slotIndex) => {
    if (slotIndex === null) return;

    const itemToReturn = quickSlots[slotIndex];
    if (!itemToReturn) return;

    setInventory(prev => {
      const existingItem = prev.find(inv => inv?.id === itemToReturn.id);
      if (existingItem) {
        return prev.map(inv =>
          inv?.id === itemToReturn.id 
            ? { ...inv, quantity: inv.quantity + itemToReturn.quantity }
            : inv
        );
      }
      return [...prev, itemToReturn];
    });

    setQuickSlots(prev => {
      const updated = [...prev];
      updated[slotIndex] = null;
      return updated;
    });
  };

  return (
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
        {/* Use Item Button */}
        <button
          onClick={() => handleItemAction('use', showItemMenu.item, showItemMenu.slotIndex)}
          className={`w-full p-2 mb-2 ${activeTheme.secondary} ${activeTheme.hover} rounded flex items-center gap-2 hover:bg-gray-700/40`}
        >
          <Trash2 className="w-4 h-4" /> Use Item
        </button>
        
        {/* Give Item Section */}
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
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setGiveAmount(Math.min(value, showItemMenu.item.quantity));
            }}
            className="w-full p-2 rounded bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-gray-500"
          />
          <button
            onClick={() => handleItemAction('give', showItemMenu.item, showItemMenu.slotIndex)}
            className={`w-full p-2 ${activeTheme.secondary} ${activeTheme.hover} rounded flex items-center justify-center gap-2 hover:bg-gray-700/40`}
          >
            <User className="w-4 h-4" /> Give Item
          </button>
        </div>

        {/* Return to Inventory Button */}
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
  );
};

export default ItemMenu;