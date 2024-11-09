import QuantitySelector from "../ui/QuantitySelector";
import { useState } from "react";
const GroundItems = ({ items, theme, handlePickupItem }) => {
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleItemClick = (item, index) => {
    if (item.quantity > 1) {
      setSelectedItem(item);
      setSelectedIndex(index);
      setShowQuantitySelector(true);
    } else {
      handlePickupItem(item, index);
    }
  };

  const handleQuantitySelect = (quantity) => {
    if (selectedItem && quantity > 0 && quantity <= selectedItem.quantity) {
      handlePickupItem(
        { ...selectedItem, selectedQuantity: quantity },
        selectedIndex
      );
    }
    setShowQuantitySelector(false);
    setSelectedItem(null);
    setSelectedIndex(null);
  };

  return (
    <>
      {items.map((item, index) => (
        <div
          key={`ground-${index}`}
          onClick={() => handleItemClick(item, index)}
          className={`${theme.secondary} ${theme.hover} p-2 rounded aspect-square flex flex-col items-center justify-center cursor-pointer`}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="text-xs text-center truncate w-full text-gray-500">
            {item.name}
          </span>
          <span className="text-xs text-gray-400">x{item.quantity}</span>
        </div>
      ))}

      {showQuantitySelector && selectedItem && (
        <QuantitySelector
          item={selectedItem}
          onSelect={handleQuantitySelect}
          onClose={() => {
            setShowQuantitySelector(false);
            setSelectedItem(null);
            setSelectedIndex(null);
          }}
        />
      )}
    </>
  );
};
export default GroundItems;