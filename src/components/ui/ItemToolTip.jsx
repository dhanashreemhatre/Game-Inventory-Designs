const ItemTooltip = ({ item }) => {
    if (!item) return null;
  
    return (
      <div className="absolute z-50 bg-gray-900/95 border border-gray-700 rounded-md p-3 -translate-y-full -translate-x-1/2 pointer-events-none shadow-xl min-w-[200px]">
        <h3 className="font-semibold text-gray-100 mb-1">{item.name}</h3>
        <div className="text-sm text-gray-300">
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{item.quantity}</span>
          </div>
          {item.type && (
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="capitalize">{item.type}</span>
            </div>
          )}
          {item.slot && (
            <div className="flex justify-between">
              <span>Slot:</span>
              <span className="capitalize">{item.slot}</span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ItemTooltip;