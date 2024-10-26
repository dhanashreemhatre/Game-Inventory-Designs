import { useDrop } from 'react-dnd';

const ItemTypes = {
    INVENTORY_ITEM: 'inventoryItem',
    QUICKSLOT_ITEM: 'quickslotItem',
    GROUND_ITEM: 'groundItem'
  };
const EmptySlot = ({ theme, onDrop, index, type }) => {
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
        ref={drop}
        className={`${theme.secondary} aspect-square rounded ${theme.hover} 
          p-2 flex items-center justify-center transition-all duration-200
          ${isOver ? 'border-2 border-white' : 'border border-gray-700'}`}
      >
        <span className="text-gray-500 text-xs">Empty</span>
      </div>
    );
  };

export default EmptySlot;