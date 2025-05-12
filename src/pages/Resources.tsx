
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ResourceCard from '@/components/resources/ResourceCard';
import { resources } from '@/data/mockData';
import { Resource } from '@/models/types';

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredResources = resources.filter(resource => 
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleResourceClick = (resource: Resource) => {
    console.log('Resource clicked:', resource);
    // Navigate to resource details page
  };

  return (
    <div className="pb-16">
      <PageHeader 
        title="Resources" 
        subtitle={`Manage all ${resources.length} resources`}
        action={<Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Resource</Button>}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
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
        {filteredResources.map((resource) => (
          <ResourceCard 
            key={resource.id} 
            resource={resource} 
            onClick={() => handleResourceClick(resource)}
          />
        ))}
      </div>
    </div>
  );
};

export default Resources;
