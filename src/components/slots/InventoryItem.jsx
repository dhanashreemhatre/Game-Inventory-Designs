import {  useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
    INVENTORY_ITEM: 'inventoryItem',
    QUICKSLOT_ITEM: 'quickslotItem',
    GROUND_ITEM: 'groundItem'
  };
  

  
// Modified InventoryItem and QuickSlot drop handling
const InventoryItem = ({ item, theme, onClick, onDrop, layout, handleDropToGround, index }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.INVENTORY_ITEM,
      item: () => ({ 
        ...item, 
        sourceIndex: index,
        sourceType: 'inventory'
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (!dropResult && item) {
          handleDropToGround(item);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [item, handleDropToGround, index]);
  
    const [{ isOver }, drop] = useDrop(() => ({
      accept: [ItemTypes.INVENTORY_ITEM, ItemTypes.QUICKSLOT_ITEM, ItemTypes.GROUND_ITEM],
      drop: (droppedItem) => {
        onDrop(droppedItem, index);
        return { dropped: true };
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }), [index, onDrop]);
  
    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`${theme.secondary} aspect-square rounded ${theme.hover} ${layout.slotStyle}
          p-2 flex flex-col items-center justify-center cursor-move transition-all duration-200
          ${isDragging ? 'opacity-50' : ''} ${isOver ? 'border-2 border-white' : ''}`}
        onClick={onClick}
      >
        <span className="text-xl mb-0.5">{item.icon}</span>
        <span className="text-xs text-center truncate w-full">{item.name}</span>
        <span className="text-xs text-gray-400">x{item.quantity}</span>
      </div>
    );
  };
  
export default InventoryItem;  