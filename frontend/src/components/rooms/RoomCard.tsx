import React from 'react';

const RoomCard = ({ room, onClick }) => {
  const availableBeds = room.totalBeds - room.occupiedBeds;

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer w-full max-w-xs" 
      onClick={() => onClick(room)}
    >
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${availableBeds > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {availableBeds > 0 ? `${availableBeds} Available` : 'Full'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600">{room.type} • Floor {room.floor}</p>
      
      <div className="mt-4">
        <p className="text-sm text-gray-700">Occupancy: {room.occupiedBeds}/{room.totalBeds} beds</p>
        
        <div className="flex gap-2 mt-2 flex-wrap">
          {(room.amenities && Array.isArray(room.amenities) ? room.amenities.slice(0, 2) : []).map((amenity, i) => (
            <span key={i} className="px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-600">{amenity}</span>
          ))}
          {room.amenities && Array.isArray(room.amenities) && room.amenities.length > 2 && (
            <span className="px-3 py-1 text-xs bg-gray-200 rounded-full text-gray-600">+{room.amenities.length - 2}</span>
          )}
        </div>
        
        <div className="font-semibold text-xl text-gray-800 mt-4">₹{room.monthlyRent}/mo</div>
      </div>
    </div>
  );
};

export default RoomCard;
