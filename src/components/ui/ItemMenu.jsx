import React, { useState, useEffect } from "react";
import { Trash2, User, ArrowLeft } from "lucide-react";

const ItemMenu = ({
  showItemMenu,
  setShowItemMenu,
  activeTheme,
  inventory,
  setInventory,
  quickSlots,
  setQuickSlots,
  menuPosition,
}) => {
  const [playerId, setPlayerId] = useState("");
  const [giveAmount, setGiveAmount] = useState(1);

  useEffect(() => {
    if (showItemMenu?.item) {
      setGiveAmount(1);
      setPlayerId("");
    }
  }, [showItemMenu]);

  if (!showItemMenu || !showItemMenu.item) return null;

  const handleItemAction = (action, item, slotIndex = null) => {
    if (!item) return;

    switch (action) {
      case "use":
        handleUseItem(item, slotIndex);
        setShowItemMenu(null); // Close menu after using item
        break;
      case "give":
        handleGiveItem(item, slotIndex);
        setShowItemMenu(null); // Close menu after giving item
        break;
      case "returnToInventory":
        handleReturnToInventory(slotIndex);
        setShowItemMenu(null); // Close menu after returning item
        break;
      default:
        break;
    }
  };

  const handleUseItem = (item, slotIndex) => {
    if (item.quantity > 1) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv?.id === item.id ? { ...inv, quantity: inv.quantity - 1 } : inv,
        ),
      );

      if (slotIndex !== null) {
        setQuickSlots((prev) => {
          const updated = [...prev];
          if (updated[slotIndex]) {
            updated[slotIndex] = { ...item, quantity: item.quantity - 1 };
          }
          return updated;
        });
      }
    } else {
      if (slotIndex !== null) {
        setQuickSlots((prev) => {
          const updated = [...prev];
          updated[slotIndex] = null;
          return updated;
        });
      }
      setInventory((prev) => prev.filter((inv) => inv?.id !== item.id));
    }
  };

  const handleGiveItem = (item, slotIndex) => {
    const amountToGive = Math.min(giveAmount, item.quantity);
    if (amountToGive <= 0) return;

    if (item.quantity > amountToGive) {
      setInventory((prev) =>
        prev.map((inv) =>
          inv?.id === item.id
            ? { ...inv, quantity: inv.quantity - amountToGive }
            : inv,
        ),
      );

      if (slotIndex !== null) {
        setQuickSlots((prev) => {
          const updated = [...prev];
          if (updated[slotIndex]) {
            updated[slotIndex] = {
              ...item,
              quantity: item.quantity - amountToGive,
            };
          }
          return updated;
        });
      }
    } else {
      if (slotIndex !== null) {
        setQuickSlots((prev) => {
          const updated = [...prev];
          updated[slotIndex] = null;
          return updated;
        });
      }
      setInventory((prev) => prev.filter((inv) => inv?.id !== item.id));
    }
  };

  const handleReturnToInventory = (slotIndex) => {
    if (slotIndex === null) return;

    const itemToReturn = quickSlots[slotIndex];
    if (!itemToReturn) return;

    setInventory((prev) => {
      // Find the first empty slot in the inventory
      const emptySlotIndex = prev.findIndex((slot) => slot === null);

      // If there's an empty slot, add the item there
      if (emptySlotIndex !== -1) {
        const newInventory = [...prev];
        newInventory[emptySlotIndex] = itemToReturn;
        return newInventory;
      }

      return prev; // If no empty slot found, return unchanged inventory
    });

    // Clear the quick slot
    setQuickSlots((prev) => {
      const updated = [...prev];
      updated[slotIndex] = null;
      return updated;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={() => setShowItemMenu(null)} // Just close the menu without any action
    >
      <div
        className={`${activeTheme.primary} rounded-lg p-4 w-64 absolute`}
        style={{
          width: "fit-content",
          maxWidth: "100%",
          maxHeight: "100%",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() =>
            handleItemAction("use", showItemMenu.item, showItemMenu.slotIndex)
          }
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
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setGiveAmount(Math.min(value, showItemMenu.item.quantity));
            }}
            className="w-full p-2 rounded bg-gray-800/50 text-white border border-gray-700 focus:outline-none focus:border-gray-500"
          />
          <button
            onClick={() =>
              handleItemAction(
                "give",
                showItemMenu.item,
                showItemMenu.slotIndex,
              )
            }
            className={`w-full p-2 ${activeTheme.secondary} ${activeTheme.hover} rounded flex items-center justify-center gap-2 hover:bg-gray-700/40`}
          >
            <User className="w-4 h-4" /> Give Item
          </button>
        </div>

        {showItemMenu.slotIndex !== null && (
          <button
            onClick={() =>
              handleItemAction(
                "returnToInventory",
                showItemMenu.item,
                showItemMenu.slotIndex,
              )
            }
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
