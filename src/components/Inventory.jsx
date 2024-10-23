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
  const initialInventoryItems = [
    { id: 1, name: "Money", icon: "💵", type: "currency", quantity: 10 },
    { id: 2, name: "Badge LSPO", icon: "👮‍♂", type: "accessory", quantity: 1 },
    { id: 3, name: "Driver's license", icon: "🪪", type: "document", quantity: 1 },
    { id: 4, name: "Boombox", icon: "📻", type: "gadget", quantity: 10 },
    { id: 5, name: "Water Bottle", icon: "🥤", type: "consumable", quantity: 10 },
    { id: 6, name: "Burger", icon: "🍔", type: "food", quantity: 10 },
    { id: 7, name: "Fry Box", icon: "🍟", type: "food", quantity: 10 },
    { id: 8, name: "Bat", icon: "🏏", type: "weapon", quantity: 1 },
    { id: 9, name: "Pistol", icon: "🔫", type: "weapon", quantity: 1 },
    { id: 10, name: "SMG", icon: "🔫", type: "weapon", quantity: 1 },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [quickItems, setQuickItems] = useState(Array(4).fill(null));
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showTooltip, setShowTooltip] = useState({ show: false, message: "" });

  const moveItemToQuickSlot = (draggedItem, targetIndex) => {
    // Check if the slot is already occupied
    if (quickItems[targetIndex]) {
      showGameNotification("This slot is already occupied!");
      return;
    }

    const updatedQuickItems = [...quickItems];
    const updatedInventory = [...inventoryItems];

    // Find the item in inventory
    const inventoryIndex = updatedInventory.findIndex(
      (item) => item.id === draggedItem.id
    );

    if (inventoryIndex !== -1) {
      // Create a new reference for the quick slot item
      updatedQuickItems[targetIndex] = {
        ...draggedItem,
        quantity: 1,
      };

      // Update inventory quantity
      if (updatedInventory[inventoryIndex].quantity > 1) {
        updatedInventory[inventoryIndex].quantity -= 1;
      } else {
        updatedInventory.splice(inventoryIndex, 1);
      }

      setQuickItems(updatedQuickItems);
      setInventoryItems(updatedInventory);
      showGameNotification(`${draggedItem.name} added to quick slot ${targetIndex + 1}`);
    }
  };

  const removeItemFromQuickSlot = (index) => {
    const updatedQuickItems = [...quickItems];
    const itemToRemove = updatedQuickItems[index];
    
    if (!itemToRemove) return;

    updatedQuickItems[index] = null;
    setQuickItems(updatedQuickItems);

    // Return item to inventory
    const existingItem = inventoryItems.find(
      (item) => item.id === itemToRemove.id
    );

    if (existingItem) {
      setInventoryItems(
        inventoryItems.map((item) =>
          item.id === itemToRemove.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setInventoryItems([...inventoryItems, { ...itemToRemove, quantity: 1 }]);
    }
    
    showGameNotification(`${itemToRemove.name} removed from quick slot`);
  };

  const showGameNotification = (message) => {
    setShowTooltip({ show: true, message });
    setTimeout(() => setShowTooltip({ show: false, message: "" }), 2000);
  };

  // Keyboard shortcuts for quick slots
  useEffect(() => {
    const handleKeyPress = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        const quickItem = quickItems[num - 1];
        if (quickItem) {
          showGameNotification(`Using ${quickItem.name}`);
          // Add your use item logic here
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [quickItems]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-800 text-white">
        {/* Game Notification */}
        {showTooltip.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            {showTooltip.message}
          </div>
        )}

        {/* Rest of your UI components... */}
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

        {/* Quick Items Section */}
        <div className="w-1/5 space-y-4">
          <h3 className="text-lg font-bold">Quick Items (1-4)</h3>
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
                selected={selectedSlot === index}
                setSelected={setSelectedSlot}
                keyBinding={index + 1}
              />
            ))}
          </div>
        </div>

        {/* ... Rest of your existing JSX ... */}
             {/* Inventory Section */}
          <div className="w-3/5 space-y-4">
            <h3 className="text-lg font-bold">Inventory</h3>
            <div className="grid grid-cols-6 gap-3">
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
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                className="block w-full text-left px-2 py-2 hover:bg-gray-700 rounded-lg"
                onClick={onUse}
              >
                Use
              </button>
              <button
                className="block w-full text-left px-2 py-2 hover:bg-gray-700 rounded-lg"
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

// Enhanced QuickSlot component with keyboard binding display and selection indicator
const QuickSlot = ({
  index,
  item,
  moveItemToQuickSlot,
  removeItem,
  setQuickItems,
  quickItems,
  selected,
  setSelected,
  keyBinding
}) => {
  const [contextMenu, setContextMenu] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const users = ["John", "Doe", "Alice", "Bob"];

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (draggedItem) => moveItemToQuickSlot(draggedItem, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`relative aspect-square flex flex-col items-center justify-center
        bg-gray-700 p-3 rounded-lg transition-colors duration-200
        ${isOver ? "bg-gray-600 border-2 border-blue-500" : "hover:bg-gray-600"}
        ${selected ? "ring-2 ring-yellow-500" : ""}
        touch-manipulation`}
      onClick={() => setSelected(index)}
    >
      {/* Key Binding Indicator */}
      <div className="absolute top-1 left-1 bg-gray-800 px-2 py-0.5 rounded text-xs">
        {keyBinding}
      </div>

      {item ? (
        <>
          <button
            className="absolute top-1 right-1 text-red-500 hover:text-red-400 p-1"
            onClick={(e) => {
              e.stopPropagation();
              removeItem(index);
            }}
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

          {/* Context menu implementation remains the same */}
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

// ... Rest of your components remain the same ...
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
