
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { fetchRooms } from '@/api/roomApi';
import { fetchTenants } from '@/api/tenantApi';
import { useNavigate } from 'react-router-dom';
import AddTenantDialog from '@/components/tenants/AddTenantDialog';

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    fetchTenants().then(data => setTenants(data));
    fetchRooms().then(data => setRooms(data));
  }, []);
  const navigate = useNavigate();
  
  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.contactNumber.includes(searchQuery) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoomNameById = (roomId: string) => {
    const room = rooms.find((room: any) => room.id === roomId);
    return room ? room.name : 'Unknown';
  };

  const handleAddTenant = () => {
    setAddDialogOpen(true);
  };

  const handleTenantAdded = (newTenant) => {
    setTenants(prevTenants => [...prevTenants, newTenant]);
  };

  return (
    <div className="pb-16">
      <PageHeader 
        title="Tenants" 
        subtitle={`Manage all ${tenants.length} tenants`}
        action={<Button size="sm" onClick={handleAddTenant}><Plus className="mr-2 h-4 w-4" /> Add Tenant</Button>}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenants..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        {filteredTenants.map((tenant) => {
          const dueDate = new Date();
          dueDate.setDate(tenant.rentDueDate);
          
          const isRentDueSoon = 
            tenant.rentDueDate - new Date().getDate() <= 5 && 
            tenant.rentDueDate - new Date().getDate() >= 0;

          return (
            <Card key={tenant.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{tenant.name}</h3>
                    {isRentDueSoon && (
                      <Badge variant="outline" className="text-xs bg-pgWarning/10 text-pgWarning border-pgWarning">
                        Rent Due Soon
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tenant.email}</p>
                  <p className="text-sm text-muted-foreground">{tenant.contactNumber}</p>
                </div>
                
                <div className="space-y-1 text-right">
                  <div className="font-medium">
                    {getRoomNameById(tenant.roomId)} • Bed {tenant.bedNumber}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Joined: {new Date(tenant.joiningDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rent Due: {tenant.rentDueDate}th of every month
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <AddTenantDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onTenantAdded={handleTenantAdded}
      />
    </div>
  );
};

export default Tenants;
