import React, { useState } from 'react';

const Item = ({ item, onDragStart = () => {}, rightClickAction, removable, removeItem }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  return (
    <div
      className="item bg-gray-600 text-white p-2 rounded cursor-pointer relative"
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onContextMenu={handleContextMenu}
    >
      <span>{item.icon} {item.name}</span>
      {showContextMenu && (
        <div className="absolute top-10 left-0 bg-gray-800 text-white p-2 rounded shadow-md z-10">
          <button onClick={() => rightClickAction('use')} className="block w-full text-left">Use</button>
          <button onClick={() => rightClickAction('throw')} className="block w-full text-left">Throw</button>
        </div>
      )}

      {removable && (
        <button onClick={removeItem} className="absolute top-1 right-1 bg-red-600 rounded-full px-2">X</button>
      )}
    </div>
  );
};

export default Item;