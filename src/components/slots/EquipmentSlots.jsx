import {  useDrop } from 'react-dnd';

const ItemTypes = {
  INVENTORY_ITEM: 'inventoryItem',
  QUICKSLOT_ITEM: 'quickslotItem',
  GROUND_ITEM: 'groundItem',
  CLOTHING_ITEM: 'clothingItem'
};

const EquipmentSlot = ({ slotName, theme, image, label, handleEquipItem, equippedItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.INVENTORY_ITEM],
    drop: (item) => {
      // Return an object containing the drop result
      const result = handleEquipItem(item, slotName);
      return { 
        dropped: true,
        slotName,
        success: result
      };
    },
    canDrop: (item) => {
      return item.type === 'clothing' && item.slot?.toLowerCase() === slotName.toLowerCase();
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <div 
      ref={drop} 
      className={`flex items-center gap-2 p-1 ${isOver ? 'bg-blue-500/20' : ''}`}
    >
      <div className={`
        ${theme.secondary} 
        ${theme.hover} 
        w-14 
        h-14 
        rounded  
        flex 
        items-center 
        justify-center 
        transition-colors 
        duration-200
        relative
        ${isOver && 'border-2 border-blue-500'}
      `}>
        <img 
          src={image} 
          alt={label} 
          className="w-10 h-10 object-contain" 
        />
        {equippedItem && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="text-2xl">{equippedItem.icon}</span>
          </div>
        )}
      </div>
   
    </div>
  );
};

export default EquipmentSlot;