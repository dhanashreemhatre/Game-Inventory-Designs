import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  hat,
  shirt,
  rifle,
  sport_shoe,
  trousers,
  watch,
} from "./images/images";
import { CiCircleRemove } from "react-icons/ci";
import { Menu, X, ChevronLeft } from "lucide-react";

const ItemTypes = {
  INVENTORY_ITEM: "inventory_item",
  QUICK_ITEM: "quick_item",
};

const InventoryApp = () => {
  // ... (previous state declarations remain the same)
  const initialInventoryItems = [
    { name: "Money", icon: "💵", type: "currency", quantity: 10 },
    { name: "Badge LSPO", icon: "👮‍♂", type: "accessory", quantity: 1 },
    { name: "Driver's license", icon: "🪪", type: "document", quantity: 1 },
    { name: "Boombox", icon: "📻", type: "gadget", quantity: 10 },
    { name: "Water Bottle", icon: "🥤", type: "consumable", quantity: 10 },
    { name: "Burger", icon: "🍔", type: "food", quantity: 10 },
    { name: "Fry Box", icon: "🍟", type: "food", quantity: 10 },
    { name: "Bat", icon: "🏏", type: "weapon", quantity: 1 },
    { name: "Pistol", icon: "🔫", type: "weapon", quantity: 1 },
    { name: "SMG", icon: "🔫", type: "weapon", quantity: 1 },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [quickItems, setQuickItems] = useState(Array(6).fill(null));
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const moveItemToQuickSlot = (item, index) => {
    const updatedQuickItems = [...quickItems];
    updatedQuickItems[index] = { ...item }; // Create a copy of the item
    setQuickItems(updatedQuickItems);

    // Remove or decrease quantity from inventory
    const updatedInventory = [...inventoryItems];
    const inventoryIndex = updatedInventory.findIndex(
      (i) => i.name === item.name,
    );

    if (inventoryIndex !== -1) {
      if (updatedInventory[inventoryIndex].quantity > 1) {
        updatedInventory[inventoryIndex].quantity -= 1;
      } else {
        updatedInventory.splice(inventoryIndex, 1);
      }
      setInventoryItems(updatedInventory);
    }
  };

  const removeItemFromQuickSlot = (index) => {
    const updatedQuickItems = [...quickItems];
    const itemToRemove = updatedQuickItems[index];
    updatedQuickItems[index] = null;
    setQuickItems(updatedQuickItems);

    // Add back to inventory with proper quantity handling
    const existingItem = inventoryItems.find(
      (item) => item.name === itemToRemove.name,
    );
    if (existingItem) {
      setInventoryItems(
        inventoryItems.map((item) =>
          item.name === itemToRemove.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setInventoryItems([...inventoryItems, { ...itemToRemove, quantity: 1 }]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-800 text-white">
        {/* Mobile Header with Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between p-4 bg-gray-900 sticky top-0 z-10">
            <h1 className="text-xl font-bold">Inventory</h1>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex justify-around border-b border-gray-700 sticky top-16 bg-gray-800 z-10">
            {["inventory", "quickItems", "clothing"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-3 flex-1 text-sm font-medium transition-colors
                  ${activeTab === tab ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex p-4 space-x-4">
          {/* Quick Items Section */}
          <div className="w-1/5 space-y-4">
            <h3 className="text-lg font-bold">Quick Items</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickItems.map((item, index) => (
                <QuickSlot
                  key={index}
                  index={index}
                  item={item}
                  moveItemToQuickSlot={moveItemToQuickSlot}
                  removeItem={removeItemFromQuickSlot}
                  setQuickItems={setQuickItems}
                  quickItems={quickItems}
                />
              ))}
            </div>
          </div>

          {/* Inventory Section */}
          <div className="w-3/5 space-y-4">
            <h3 className="text-lg font-bold">Inventory</h3>
            <div className="grid grid-cols-4 gap-3">
              {inventoryItems.map((item, index) => (
                <InventoryItem
                  key={index}
                  item={item}
                  setInventoryItems={setInventoryItems}
                  inventoryItems={inventoryItems}
                />
              ))}
            </div>
          </div>

          {/* Clothing Section */}
          <div className="w-1/5 space-y-4">
            <h3 className="text-lg font-bold">Clothing</h3>
            <ClothingSection />
          </div>
        </div>

        {/* Mobile Content */}
        <div className="lg:hidden p-4">
          <div className="space-y-4">
            {activeTab === "inventory" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {inventoryItems.map((item, index) => (
                  <InventoryItem
                    key={index}
                    item={item}
                    setInventoryItems={setInventoryItems}
                    inventoryItems={inventoryItems}
                  />
                ))}
              </div>
            )}

            {activeTab === "quickItems" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickItems.map((item, index) => (
                  <QuickSlot
                    key={index}
                    index={index}
                    item={item}
                    moveItemToQuickSlot={moveItemToQuickSlot}
                    removeItem={removeItemFromQuickSlot}
                    setQuickItems={setQuickItems}
                    quickItems={quickItems}
                  />
                ))}
              </div>
            )}

            {activeTab === "clothing" && <ClothingSection />}
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Separate Clothing Section Component for reusability
const ClothingSection = () => (
  <div className="bg-gray-700 p-4 rounded-lg">
    <div className="grid grid-cols-3 gap-3">
      <div className="col-start-2">
        <ClothingSlot name={hat} label="Hat" />
      </div>
      <div></div>
      <div>
        <ClothingSlot name={watch} label="Watch" />
      </div>
      <div>
        <ClothingSlot name={shirt} label="Shirt" />
      </div>
      <div>
        <ClothingSlot name={rifle} label="Weapon" />
      </div>
      <div className="col-start-2">
        <ClothingSlot name={trousers} label="Pants" />
      </div>
      <div className="col-start-2">
        <ClothingSlot name={sport_shoe} label="Shoes" />
      </div>
    </div>
  </div>
);

const ItemContextMenu = ({ onUse, onGive, users, onClose }) => {
  const menuRef = useRef(null);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={menuRef}
        className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-xs"
      >
        <div className="p-2">
          {showUsers && (
            <button
              className="flex items-center space-x-2 w-full px-4 py-3 text-gray-400 hover:text-white"
              onClick={() => setShowUsers(false)}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {!showUsers ? (
            <>
              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg"
                onClick={onUse}
              >
                Use
              </button>
              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg"
                onClick={() => setShowUsers(true)}
              >
                Give
              </button>
            </>
          ) : (
            <div>
              {users.map((user, index) => (
                <button
                  key={index}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg"
                  onClick={() => onGive(user)}
                >
                  {user}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InventoryItem = ({ item, setInventoryItems, inventoryItems }) => {
  const [contextMenu, setContextMenu] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const users = ["John", "Doe", "Alice", "Bob"];

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INVENTORY_ITEM,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleTouchStart = () => {
    const timer = setTimeout(() => setContextMenu(true), 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div
      ref={drag}
      className={`relative flex flex-col items-center justify-center bg-gray-700 p-3 rounded-lg
        ${isDragging ? "opacity-50" : ""} hover:bg-gray-600 transition-colors duration-200
        aspect-square touch-manipulation`}
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu(true);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <span className="text-2xl sm:text-3xl lg:text-4xl mb-1">{item.icon}</span>
      <span className="text-xs sm:text-sm text-center truncate w-full px-1">
        {item.name}
      </span>
      <span className="text-xs text-gray-400">Qty: {item.quantity}</span>

      {contextMenu && (
        <ItemContextMenu
          onUse={() => {
            if (item.quantity > 1) {
              setInventoryItems(
                inventoryItems.map((invItem) =>
                  invItem.name === item.name
                    ? { ...invItem, quantity: invItem.quantity - 1 }
                    : invItem,
                ),
              );
            } else {
              setInventoryItems(
                inventoryItems.filter((invItem) => invItem.name !== item.name),
              );
            }
            setContextMenu(false);
          }}
          onGive={(user) => {
            setContextMenu(false);
          }}
          users={users}
          onClose={() => setContextMenu(false)}
        />
      )}
    </div>
  );
};

const QuickSlot = ({
  index,
  item,
  moveItemToQuickSlot,
  removeItem,
  setQuickItems,
  quickItems,
}) => {
  const [contextMenu, setContextMenu] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const users = ["John", "Doe", "Alice", "Bob"];

  const [, drop] = useDrop({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (draggedItem) => moveItemToQuickSlot(draggedItem, index),
  });

  const handleTouchStart = () => {
    if (!item) return;
    const timer = setTimeout(() => setContextMenu(true), 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  return (
    <div
      ref={drop}
      className="relative aspect-square flex flex-col items-center justify-center
        bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200
        touch-manipulation"
      onContextMenu={(e) => {
        if (!item) return;
        e.preventDefault();
        setContextMenu(true);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {item ? (
        <>
          <button
            className="absolute top-1 right-1 text-red-500 hover:text-red-400 p-1"
            onClick={() => removeItem(index)}
          >
            <CiCircleRemove className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <span className="text-2xl sm:text-3xl lg:text-4xl mb-1">
            {item.icon}
          </span>
          <span className="text-xs sm:text-sm text-center truncate w-full px-1">
            {item.name}
          </span>
          <span className="text-xs text-gray-400">Qty: {item.quantity}</span>

          {contextMenu && (
            <ItemContextMenu
              onUse={() => {
                if (item.quantity > 1) {
                  const updatedQuickItems = [...quickItems];
                  updatedQuickItems[index] = {
                    ...item,
                    quantity: item.quantity - 1,
                  };
                  setQuickItems(updatedQuickItems);
                } else {
                  removeItem(index);
                }
                setContextMenu(false);
              }}
              onGive={(user) => {
                setContextMenu(false);
              }}
              users={users}
              onClose={() => setContextMenu(false)}
            />
          )}
        </>
      ) : (
        <span className="text-gray-500 text-sm">Empty</span>
      )}
    </div>
  );
};

const ClothingSlot = ({ name, label }) => (
  <div
    className="aspect-square flex flex-col items-center justify-center
    bg-gray-700 p-2 sm:p-3 rounded-lg hover:bg-gray-600 transition-colors duration-200"
  >
    <img src={name} alt={label} className="w-6 h-6 sm:w-8 sm:h-8 mb-1" />
    <span className="text-xs text-gray-400 truncate w-full text-center">
      {label}
    </span>
  </div>
);

export default InventoryApp;