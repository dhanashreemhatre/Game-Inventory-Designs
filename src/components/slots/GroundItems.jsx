import {  useDrag } from 'react-dnd';

const ItemTypes = {
    INVENTORY_ITEM: 'inventoryItem',
    QUICKSLOT_ITEM: 'quickslotItem',
    GROUND_ITEM: 'groundItem'
  };
  
// Ground Items Mapping
const GroundItems = ({ items, handlePickupItem, theme }) => {
    return items.map((item, index) => (
      <GroundItem
        key={item.id}
        item={item}
        theme={theme}
        onPickup={() => handlePickupItem(item, index)}
      />
    ));
  };
  
  // Ground Item Component
  const GroundItem = ({ item, theme, onPickup }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemTypes.GROUND_ITEM,
      item: () => ({
        ...item,
        sourceType: 'ground'
      }),
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
          onPickup(item.id);
        }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }), [item, onPickup]);
  
    return (
      <div
        ref={drag}
        className={`${theme.secondary} aspect-square rounded ${theme.hover}
          p-2 flex flex-col items-center justify-center cursor-move transition-all duration-200
          ${isDragging ? 'opacity-50' : ''} ${theme.hover}`}
      >
        <span className="text-xl mb-0.5">{item.icon}</span>
        <span className="text-xs text-center truncate w-full">{item.name}</span>
        <span className="text-xs text-gray-400">x{item.quantity}</span>
      </div>
    );
  };
  
  
export default GroundItems;