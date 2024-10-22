import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { hat, shirt, rifle, sport_shoe, trousers, watch } from "./images/images";
import { CiCircleRemove } from "react-icons/ci";

// Drag types
const ItemTypes = {
  INVENTORY_ITEM: "inventory_item",
  QUICK_ITEM: "quick_item",
};

const InventoryApp = () => {
  const initialInventoryItems = [
    { name: "Money", icon: "💵", type: "currency", quantity: 10 },
    { name: "Badge LSPO", icon: "👮‍♂️", type: "accessory", quantity: 1 },
    { name: "Driver's license", icon: "🪪", type: "document", quantity: 1 },
    { name: "Boombox", icon: "📻", type: "gadget", quantity: 10 },
    { name: "Water Bottle", icon: "🥤", type: "consumable", quantity: 10 },
    { name: "Burger", icon: "🍔", type: "food", quantity: 10 },
    { name: "Fry Box", icon: "🍟", type: "food", quantity: 10 },
    { name: "Bat", icon: "🏏", type: "weapon", quantity: 1 },
    { name: "Pistol", icon: "🔫", type: "weapon", quantity: 1 },
    { name: "SMG", icon: "🔫", type: "weapon", quantity: 1 },
  ];

  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [quickItems, setQuickItems] = useState(Array(6).fill(null)); // Quick slots

  // Handle dropping item into quick slots
  const moveItemToQuickSlot = (item, index) => {
    const updatedQuickItems = [...quickItems];
    updatedQuickItems[index] = item;
    setQuickItems(updatedQuickItems);

    // Remove from inventory
    const updatedInventory = inventoryItems.filter(
      (invItem) => invItem.name !== item.name
    );
    setInventoryItems(updatedInventory);
  };

  // Handle removing item from quick slots
  const removeItemFromQuickSlot = (index) => {
    const updatedQuickItems = [...quickItems];
    const itemToRemove = updatedQuickItems[index];
    updatedQuickItems[index] = null;
    setQuickItems(updatedQuickItems);
    setInventoryItems([...inventoryItems, itemToRemove]); // Add back to inventory
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-800 text-white p-4">
        <div className="flex space-x-4">
          {/* Quick Items Section */}
          <div className="w-1/5">
            <h3 className="text-lg font-bold mb-4">Quick Items</h3>
            <div className="grid grid-cols-1 gap-4">
              {quickItems.map((item, index) => (
                <QuickSlot
                  key={index}
                  index={index}
                  item={item}
                  moveItemToQuickSlot={moveItemToQuickSlot}
                  removeItem={removeItemFromQuickSlot}
                />
              ))}
            </div>
          </div>

          {/* Inventory Section */}
          <div className="w-3/5">
            <h3 className="text-lg font-bold mb-4">Inventory</h3>
            <div className="grid grid-cols-4 gap-4">
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
          <div className="w-1/5">
            <h3 className="text-lg font-bold mb-4">Clothing</h3>
            <div className="grid grid-cols-1 gap-4">
              <ClothingSlot name={hat} />
              <ClothingSlot name={shirt} />
              <ClothingSlot name={trousers} />
              <ClothingSlot name={sport_shoe} />
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Inventory Item Component with right-click options
const InventoryItem = ({ item, setInventoryItems, inventoryItems }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showGiveOptions, setShowGiveOptions] = useState(false);
  const contextMenuRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INVENTORY_ITEM,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const users = ["John", "Doe", "Alice", "Bob"]; // Example users

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  const handleClickOutside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false);
      setShowGiveOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleUse = () => {
    if (item.quantity > 1) {
      setInventoryItems(
        inventoryItems.map((invItem) =>
          invItem.name === item.name
            ? { ...invItem, quantity: invItem.quantity - 1 }
            : invItem
        )
      );
    } else {
      setInventoryItems(inventoryItems.filter((invItem) => invItem.name !== item.name));
    }
    setShowContextMenu(false); // Close context menu
  };

  const handleGive = () => {
    setShowGiveOptions(true);
    setShowContextMenu(false);
  };

  return (
    <div
      ref={drag}
      className={`relative flex flex-col items-center bg-gray-700 p-4 rounded-md ${
        isDragging ? "opacity-50" : ""
      }`}
      onContextMenu={handleContextMenu}
    >
      <span className="text-4xl">{item.icon}</span>
      <span className="mt-2 text-sm">
        {item.name} ({item.quantity})
      </span>

      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute top-10 left-0 bg-gray-800 text-white p-2 rounded shadow-md z-10"
        >
          <button onClick={handleUse} className="block w-full text-left">Use</button>
          <button onClick={handleGive} className="block w-full text-left">Give</button>
        </div>
      )}

      {showGiveOptions && (
        <div className="absolute top-10 left-0 bg-gray-800 text-white p-2 rounded shadow-md z-10">
          {users.map((user, index) => (
            <button key={index} className="block w-full text-left">
              Give to {user}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Quick Slot Component
const QuickSlot = ({ index, item, moveItemToQuickSlot, removeItem }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.INVENTORY_ITEM,
    drop: (draggedItem) => moveItemToQuickSlot(draggedItem, index),
  });

  return (
    <div
      ref={drop}
      className="flex flex-col items-center bg-gray-700 p-4 rounded-md"
    >
      {item ? (
        <>
          <button
            className="ml-auto mt-2 bg-red-500 text-sm px-2 py-1 rounded-md"
            onClick={() => removeItem(index)}
          >
            <CiCircleRemove />
          </button>
          <span className="text-4xl">{item.icon}</span>
          <span className="mt-2 text-sm">{item.name}</span>
        </>
      ) : (
        <span className="text-gray-500">Empty Slot</span>
      )}
    </div>
  );
};

// Clothing Slot Component
const ClothingSlot = ({ name }) => (
  <div className="flex flex-col items-center bg-gray-700 p-4 rounded-md">
    <img src={name} alt="clothing" className="w-10 h-10" />
  </div>
);

export default InventoryApp;
