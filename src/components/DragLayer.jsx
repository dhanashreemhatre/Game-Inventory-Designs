import { useDrag } from "react-dnd";
const DragLayer = () => {
  const { draggedItem, dragPosition, isDragging } = useDrag();

  if (!isDragging || !draggedItem) return null;

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: dragPosition.x,
        top: dragPosition.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="bg-gray-800 p-2 rounded opacity-70">
        <span className="text-xl">{draggedItem.icon}</span>
      </div>
    </div>
  );
};

export default DragLayer;
