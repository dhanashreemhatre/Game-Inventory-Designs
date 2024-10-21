import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {hat,shirt, rifle, sport_shoe, trousers, watch} from "./images/images";
import { CiCircleRemove } from "react-icons/ci";

// Drag types
const ItemTypes = {
  INVENTORY_ITEM: "inventory_item",
  QUICK_ITEM: "quick_item",
};

const InventoryApp = () => {
  const initialInventoryItems = [
    { name: "Money", icon: "💵" },
    { name: "Badge LSPO", icon: "👮‍♂️" },
    { name: "Driver's license", icon: "🪪" },
    { name: "Boombox", icon: "📻" },
    { name: "Water Bottle", icon: "🥤" },
    { name: "Burger", icon: "🍔" },
    { name: "Fry Box", icon: "🍟" },
    { name: "Bat", icon: "🏏" },
    { name: "Pistol", icon: "🔫" },
    { name: "SMG", icon: "🔫" },
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
    setQuickItems(updatedQuickItems);
    setInventoryItems([...inventoryItems, itemToRemove]); // Add back to inventory
    updatedQuickItems[index] = null;
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
                <InventoryItem key={index} item={item} />
              ))}
            </div>
          </div>

          {/* Clothing Section */}
          <div className="w-1/5">
            <h3 className="text-lg font-bold mb-4">Clothing</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <ClothingSlot name={hat} />
              </div>
              <div className="flex items-center">
                <ClothingSlot name={shirt} />
              </div>
              <div className="flex items-center">
                <ClothingSlot name={trousers} />
              </div>
              <div className="flex items-center">
                <ClothingSlot name={sport_shoe} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

// Inventory Item Component
const InventoryItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.INVENTORY_ITEM,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center bg-gray-700 p-4 rounded-md ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <span className="text-4xl">{item.icon}</span>
      <span className="mt-2 text-sm">{item.name}</span>
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
            <CiCircleRemove/>
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
const ClothingSlot = ({ name }) => {
  return (
    <div className="flex flex-col items-center bg-gray-700 p-4 rounded-md">
      <img src={name} alt="shoes" className="ml-2 w-10 h-10" />
    </div>
  );
};

export default InventoryApp;
