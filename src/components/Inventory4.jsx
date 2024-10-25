import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const InventorySystem = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [slots] = useState(Array(50).fill(null));
  const [inventory, setInventory] = useState([
    { id: '1', name: 'Item 1', type: 'weapon', slot: 0 },
    { id: '2', name: 'Item 2', type: 'armor', slot: 1 },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(inventory);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setInventory(items);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-gray-200">
      {/* Navigation Tabs */}
      <div className="flex space-x-4 p-4 border-b border-gray-800">
        <TabButton 
          active={activeTab === 'inventory'} 
          onClick={() => setActiveTab('inventory')}
          icon={<BackpackIcon />}
          label="РЮКЗАК"
        />
        <TabButton 
          active={activeTab === 'items'} 
          onClick={() => setActiveTab('items')}
          icon={<ItemsIcon />}
          label="ВАШИ ВЕЩИ"
        />
        <TabButton 
          active={activeTab === 'trade'} 
          onClick={() => setActiveTab('trade')}
          icon={<TradeIcon />}
          label="ОБМЕН"
        />
      </div>

      <div className="flex p-6">
        {/* Left Side - Grid Inventory */}
        <div className="w-2/3 pr-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="inventory">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-5 gap-2"
                >
                  {slots.map((_, index) => {
                    const item = inventory.find(i => i.slot === index);
                    return (
                      <div 
                        key={index}
                        className={`
                          aspect-square relative 
                          ${item ? 'bg-gray-800' : 'bg-gray-900'} 
                          border border-gray-700 rounded-lg
                          hover:border-red-500 transition-colors
                        `}
                      >
                        {item && (
                          <Draggable draggableId={item.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="w-full h-full p-2"
                              >
                                <div className="flex flex-col items-center justify-center h-full">
                                  <div className="w-8 h-8 bg-gray-700 rounded-lg mb-2"></div>
                                  <span className="text-xs text-gray-400">{item.name}</span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )}
                        <div className="absolute top-1 left-1 text-xs text-gray-600">
                          {index + 1}
                        </div>
                      </div>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Right Side - Statistics */}
        <div className="w-1/3">
          <div className="bg-gray-900 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4 text-red-500">Статистика</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Slots used:</span>
                <span>{inventory.length}/50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon Components
const BackpackIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4zm11 16H4V9h16v11z"/>
  </svg>
);

const ItemsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
  </svg>
);

const TradeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
  </svg>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center space-x-2 px-4 py-2 rounded-lg
      transition-colors duration-200
      ${active ? 'bg-red-500 text-white' : 'text-gray-400 hover:bg-gray-800'}
    `}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default InventorySystem;