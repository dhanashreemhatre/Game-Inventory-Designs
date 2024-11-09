const EmptySlot = ({ theme, onDrop, index, type }) => {
  return (
    <div
      data-droppable="true"
      data-index={index}
      data-type={type}
      className={`${theme.secondary} aspect-square rounded ${theme.hover}
        p-2 flex items-center justify-center transition-all duration-200`}
    >
      <span className="text-gray-500 text-xs">Empty</span>
    </div>
  );
};

export default EmptySlot;
