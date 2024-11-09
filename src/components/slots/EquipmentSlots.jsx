import ItemTooltip from "../ui/ItemToolTip";
import React from "react";
const EquipmentSlot = ({
  slotName,
  theme,
  image,
  label,
  handleEquipItem,
  equippedItem,
}) => {
const [showTooltip, setShowTooltip] = React.useState(false);
const [tooltipPosition, setTooltipPosition] = React.useState({ x: 0, y: 0 });
const handleMouseEnter = (e) => {
  if (!equippedItem) return;
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


  return (
    <div
      data-droppable="true"
      data-type="equipment"
      data-slot-name={slotName}
      className={`${theme.secondary} ${theme.hover} p-2 aspect-square rounded flex items-center justify-center gap-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      

      {equippedItem ? (
        <div className="flex items-center gap-1">
          <span className="text-xl">{equippedItem.icon}</span>
        </div>
      ):
     ( <div className="w-12 h-12 flex items-center justify-center">
      <img src={image} alt={label} className="w-12 h-12 opacity-50" />
    </div>)}
    {showTooltip && equippedItem && (
        <div style={{ position: 'fixed', left: tooltipPosition.x, top: tooltipPosition.y }}>
          <ItemTooltip item={equippedItem} />
        </div>
      )}
    </div>
  );
};

export default EquipmentSlot;
