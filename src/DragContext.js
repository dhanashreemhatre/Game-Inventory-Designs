import React, { createContext, useContext, useState } from "react";

const DragContext = createContext(null);

export function DragProvider({ children }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const value = {
    draggedItem,
    setDraggedItem,
    dragPosition,
    setDragPosition,
    isDragging,
    setIsDragging,
  };

  return (
    <DragContext.Provider value={value}>
      {children}
      {isDragging && draggedItem && (
        <div
          style={{
            position: "fixed",
            left: dragPosition.x,
            top: dragPosition.y,
            pointerEvents: "none",
            zIndex: 1000,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="bg-gray-800/80 p-2 rounded">
            <span className="text-2xl">{draggedItem.icon}</span>
          </div>
        </div>
      )}
    </DragContext.Provider>
  );
}

export function useDrag() {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDrag must be used within a DragProvider");
  }
  return context;
}
