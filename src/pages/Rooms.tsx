
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RoomCard from '@/components/rooms/RoomCard';
import { ROOMS_DATA } from '@/api/data';
import { Room } from '@/models/types';

const Rooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredRooms = ROOMS_DATA.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleRoomClick = (room: Room) => {
    console.log('Room clicked:', room);
    // Navigate to room details page
  };

  return (
    <div className="pb-16">
      <PageHeader 
        title="Rooms" 
        subtitle={`Manage all ${ROOMS_DATA.length} rooms`}
        action={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Room</Button>}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onClick={() => handleRoomClick(room)}
          />
        ))}
      </div>
    </div>
  );
};

export default Rooms;
