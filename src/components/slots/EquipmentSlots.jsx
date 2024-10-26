const EquipmentSlot = ({ theme, image, label }) => (
    <div className="flex items-center gap-2 p-1">
      <div className={`
        ${theme.secondary} 
        ${theme.hover} 
        w-14 
        h-14 
        rounded  
        flex 
        items-center 
        justify-center 
        transition-colors 
        duration-200
      `}>
        <img 
          src={image} 
          alt={label} 
          className="w-10 h-10 object-contain" 
        />
      </div>
    </div>
  );

  export default EquipmentSlot;