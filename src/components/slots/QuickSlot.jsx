import {  useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
    INVENTORY_ITEM: 'inventoryItem',
    QUICKSLOT_ITEM: 'quickslotItem',
    GROUND_ITEM: 'groundItem'
  };

const QuickSlot = ({ item, theme, index, onClick, onDrop, layout, handleDropToGround }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.QUICKSLOT_ITEM,
      item: () => ({ 
        ...item, 
        sourceIndex: index,
        sourceType: 'quickslot'
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
      accept: [ItemTypes.INVENTORY_ITEM, ItemTypes.QUICKSLOT_ITEM],
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
        className={`${theme.secondary} ${theme.hover} ${layout.slotStyle} aspect-square rounded
          p-2 flex flex-col items-center justify-center relative transition-all duration-200
          ${isOver ? 'border-2 border-white' : ''} ${isDragging ? 'opacity-50' : ''}`}
        onClick={onClick}
      >
        {item && (
          <>
            <div className="absolute top-1 left-1 text-xs bg-black/50 px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
            <span className="text-xl mb-0.5">{item.icon}</span>
            <span className="text-xs text-center truncate w-full">{item.name}</span>
            <span className="text-xs text-gray-400">x{item.quantity}</span>
          </>
        )}
      </div>
    );
  };
  
export default QuickSlot;  