import React, { useState, useEffect } from 'react';

const inventoryItems = [
  { id: 1, name: "Weapon 1", icon: "🔫" },
  { id: 2, name: "Weapon 2", icon: "⚔️" },
  { id: 3, name: "Health Pack", icon: "🩹" },
  { id: 4, name: "Cheese", icon: "🧀" },
  { id: 5, name: "Potion", icon: "🧪" },
  // Add more items as needed
];

const Inventory = () => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  // Handle keyboard arrow navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      setSelectedItemIndex((prevIndex) => (prevIndex + 1) % inventoryItems.length);
    } else if (e.key === "ArrowLeft") {
      setSelectedItemIndex((prevIndex) => (prevIndex - 1 + inventoryItems.length) % inventoryItems.length);
    } else if (e.key === "ArrowUp") {
      setSelectedItemIndex((prevIndex) => (prevIndex - 4 + inventoryItems.length) % inventoryItems.length);
    } else if (e.key === "ArrowDown") {
      setSelectedItemIndex((prevIndex) => (prevIndex + 4) % inventoryItems.length);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold">Inventory</div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {inventoryItems.map((item, index) => (
          <div
            key={item.id}
            className={`p-4 border-2 rounded-lg ${selectedItemIndex === index ? 'border-green-500' : 'border-gray-500'}`}
          >
            <div className="text-2xl">{item.icon}</div>
            <div className="text-sm">{item.name}</div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => alert(`Selected item: ${inventoryItems[selectedItemIndex].name}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Use Item
        </button>
      </div>
    </div>
  );
};

export default Inventory;
