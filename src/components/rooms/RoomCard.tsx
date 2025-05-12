
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/models/types";
import { Badge } from "@/components/ui/badge";

interface RoomCardProps {
  room: Room;
  onClick?: () => void;
}

const RoomCard = ({ room, onClick }: RoomCardProps) => {
  const availableBeds = room.totalBeds - room.occupiedBeds;
  const occupancyPercentage = (room.occupiedBeds / room.totalBeds) * 100;

  return (
    <Card 
      className="h-full transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          <Badge variant={availableBeds > 0 ? 'outline' : 'destructive'}>
            {availableBeds > 0 ? `${availableBeds} Available` : 'Full'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {room.type} • Floor {room.floor}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Occupancy</span>
              <span className="font-medium">{room.occupiedBeds}/{room.totalBeds} beds</span>
            </div>
            <div className="h-2 w-full bg-pgPurple-light rounded-full">
              <div 
                className="h-2 bg-pgPurple rounded-full" 
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-1 flex-wrap">
              {room.amenities.slice(0, 2).map((amenity, i) => (
                <Badge key={i} variant="secondary" className="text-xs">{amenity}</Badge>
              ))}
              {room.amenities.length > 2 && (
                <Badge variant="secondary" className="text-xs">+{room.amenities.length - 2}</Badge>
              )}
            </div>
            <div className="font-medium">₹{room.monthlyRent}/mo</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
