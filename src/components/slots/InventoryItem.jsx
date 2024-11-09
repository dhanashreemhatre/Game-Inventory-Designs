import { useDrag } from "./../../DragContext";
import React from "react";
import QuantitySelector from "../ui/QuantitySelector";
import ItemTooltip from "../ui/ItemToolTip";

// Enhanced InventoryItem.jsx
const InventoryItem = ({
  item,
  theme,
  onClick,
  onDrop,
  layout,
  handleDropToGround,
  updateItemQuantity,
  index,
}) => {
  const { setDraggedItem, setDragPosition, setIsDragging } = useDrag();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [showQuantitySelector, setShowQuantitySelector] = React.useState(false);
  const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey && item.quantity > 1) {
      e.preventDefault();
      setShowQuantitySelector(true);
      return;
    }

    let dragStarted = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const clickedElement = e.currentTarget;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance > 5 && !dragStarted) {
        dragStarted = true;
        setDraggedItem({
          ...item,
          sourceType: "inventory",
          sourceIndex: index,
        });
        setIsDragging(true);
        setDragPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        });
      }
    };

    const handleMouseUp = (upEvent) => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);

      if (!dragStarted && upEvent.button === 0) {
        onClick({
          ...upEvent,
          currentTarget: clickedElement,
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // 4. Update the QuantitySelector component's handleSelect function
const handleQuantitySelect = (selectedQuantity) => {
  if (!item || selectedQuantity <= 0 || selectedQuantity > item.quantity) return;
  
  // const remainingQuantity = item.quantity - selectedQuantity;
  
  // Update the original item quantity
  // updateItemQuantity(index, remainingQuantity);
  
  // Create the split item for dragging
  const splitItem = {
    ...item,
    quantity: selectedQuantity,
    sourceType: "inventory",
    sourceIndex: index,
    splitItem: true
  };
  
  setDraggedItem(splitItem);
  setIsDragging(true);
  setShowQuantitySelector(false);
  
  if (window.event) {
    setDragPosition({
      x: window.event.clientX,
      y: window.event.clientY
    });
  }
};
  return (
    <>
      <div
        data-droppable="true"
        data-index={index}
        data-type="inventory"
        className={`${theme.secondary} aspect-square rounded ${theme.hover} ${layout.slotStyle}
          p-2 flex flex-col items-center justify-center cursor-move transition-all duration-200 relative`}
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="text-xl mb-0.5">{item.icon}</span>
        <span className="text-xs text-center text-gray-500 truncate w-full">{item.name}</span>
        <span className="text-xs text-gray-400">x{item.quantity}</span>
      </div>
      
      {showTooltip && (
        <div style={{ position: 'fixed', left: tooltipPosition.x, top: tooltipPosition.y }}>
          <ItemTooltip item={item} />
        </div>
      )}
      
      {showQuantitySelector && (
        <QuantitySelector
          item={item}
          onSelect={handleQuantitySelect}
          onClose={() => setShowQuantitySelector(false)}
        />
      )}
    </>
  );
};

export default InventoryItem;

