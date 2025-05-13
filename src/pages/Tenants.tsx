
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TENANTS_DATA, ROOMS_DATA } from '@/api/data';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Tenants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredTenants = TENANTS_DATA.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.contactNumber.includes(searchQuery) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getRoomNameById = (roomId: string) => {
    const room = ROOMS_DATA.find(room => room.id === roomId);
    return room ? room.name : 'Unknown';
  };

  const handleAddTenant = () => {
    // For now, just show a toast notification
    toast.info("Add Tenant feature is coming soon!");
    // Later this can navigate to a form or open a dialog
    // navigate('/add-tenant');
  };

  return (
    <div className="pb-16">
      <PageHeader 
        title="Tenants" 
        subtitle={`Manage all ${TENANTS_DATA.length} tenants`}
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
    </div>
  );
};

export default Tenants;
