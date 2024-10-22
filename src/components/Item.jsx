import React, { useState, useRef, useEffect } from 'react';
import { X, MoreVertical, ChevronRight } from 'lucide-react';

const Item = ({ 
  item, 
  onDragStart = () => {}, 
  rightClickAction, 
  removable, 
  removeItem 
}) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  const handleTouchMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(!showContextMenu);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors duration-200 touch-manipulation"
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onContextMenu={handleContextMenu}
      >
        {/* Main content */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0 text-gray-600">
            {item.icon}
          </div>
          <span className="truncate font-medium text-gray-800">
            {item.name}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {/* Mobile menu trigger */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full md:hidden"
            onClick={handleTouchMenu}
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Remove button if removable */}
          {removable && (
            <button
              onClick={removeItem}
              className="p-2 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
        >
          <button
            onClick={() => {
              rightClickAction('use');
              setShowContextMenu(false);
            }}
            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="flex-1">Use</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => {
              rightClickAction('throw');
              setShowContextMenu(false);
            }}
            className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="flex-1">Throw</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Item;