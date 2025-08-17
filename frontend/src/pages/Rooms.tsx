import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import RoomCard from '@/components/rooms/RoomCard';
import { fetchRooms } from '@/api/roomApi';
import { fetchTenants } from '@/api/tenantApi';
import { Room } from '@/models/types';
import AddRoomDialog from '@/components/rooms/AddRoomDialog';
import AddTenantDialog from '@/components/tenants/AddTenantDialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Rooms = () => {
  console.log('Rooms component rendered');
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [count, setCount] = useState(0);
  const [tenantDialogOpen, setTenantDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [roomsData, tenantsData] = await Promise.all([
        fetchRooms(),
        fetchTenants()
      ]);
      setRooms(roomsData);
      setTenants(tenantsData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate room statistics based on tenants
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, room) => acc + room.totalBeds, 0);
  // Calculate occupied beds by counting tenants per room
  const roomIdToOccupiedBeds: Record<string, number> = {};
  tenants.forEach((tenant) => {
    if (tenant.roomId) {
      roomIdToOccupiedBeds[tenant.roomId] = (roomIdToOccupiedBeds[tenant.roomId] || 0) + 1;
    }
  });
  const occupiedBeds = rooms.reduce((acc, room) => acc + (roomIdToOccupiedBeds[room.id] || 0), 0);
  const vacantBeds = totalBeds - occupiedBeds;

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const occupancyData = [
    { name: 'Occupied', value: occupiedBeds, color: '#9b87f5' },
    { name: 'Vacant', value: vacantBeds, color: '#22c55e' },
  ];
  
  const handleRoomClick = (room: Room) => {
    // Calculate occupied beds for this room
    const occupied = roomIdToOccupiedBeds[room.id] || 0;
    if (occupied < room.totalBeds) {
      setSelectedRoom(room);
      setTenantDialogOpen(true);
    }
    // else you could show a toast here if desired
  };

  // Helper to refresh rooms and tenants after tenant is added
  const refreshRooms = async () => {
    setLoading(true);
    const [roomsData, tenantsData] = await Promise.all([
      fetchRooms(),
      fetchTenants()
    ]);
    setRooms(roomsData);
    setTenants(tenantsData);
    setLoading(false);
  };

  return (
    <div className="pb-16">
      <PageHeader 
        title="Rooms" 
        subtitle={`Manage all ${totalRooms} rooms`}
        action={
          <>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>
          </>
        }
      />
      {/* <p>{count && <span className="text-sm text-gray-500">({count})</span>}</p> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Occupancy Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="text-2xl font-bold mb-1">{occupancyRate}%</div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pgPurple" 
                    style={{ width: `${occupancyRate}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <span className="h-3 w-3 rounded-full bg-pgPurple"></span>
                  <span className="text-sm">{occupiedBeds} Occupied</span>
                </div>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  <span className="h-3 w-3 rounded-full bg-green-500"></span>
                  <span className="text-sm">{vacantBeds} Vacant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Room Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(rooms.reduce((acc, room) => {
                acc[room.type] = (acc[room.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <Badge variant="outline">{type}</Badge>
                  <span className="text-sm font-medium">{count} rooms</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* // Search and Filter */}
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
      <AddRoomDialog 
        open={addDialogOpen} 
        onOpenChange={(isOpen) => {
          setAddDialogOpen(isOpen);
          if (!isOpen) {
            refreshRooms(); // Refresh rooms after dialog is closed
          }
        }}
      />
      <AddTenantDialog
        open={tenantDialogOpen}
        onOpenChange={setTenantDialogOpen}
        room={selectedRoom}
        onTenantAdded={refreshRooms}
      />
    </div>
  );
};

export default Rooms;
