import React from 'react';

const GroundItemsPanel = ({ groundItems, onPickupItem }) => {
  const handlePickupItem = (item, index) => {
    onPickupItem(item, index);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="grid grid-cols-4 gap-2">
        {groundItems.map((item, index) => (
          <button
            key={`${item.id}-${index}`}
            className="p-2 bg-white rounded shadow hover:bg-gray-50 flex items-center justify-center"
            onClick={() => handlePickupItem(item, index)}
          >
            <div className="text-center">
              <div className="font-medium">{item.name}</div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-600">x{item.quantity}</div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroundItemsPanel;