import React from "react";
const QuantitySelector = ({ item, onSelect, onClose }) => {
    const [quantity, setQuantity] = React.useState(1);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSelect(Math.min(Math.max(1, quantity), item.quantity));
      onClose();
    };
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 w-64" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-4">Select Quantity</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm mb-2">Amount (max: {item.quantity})</label>
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-gray-800 border border-gray-700 rounded p-2"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded p-2"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 rounded p-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  export default QuantitySelector;