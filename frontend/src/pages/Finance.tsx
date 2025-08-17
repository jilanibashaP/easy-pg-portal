import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Finance = () => {
  return (
    <div className="pb-16">
      <PageHeader 
        title="Finance" 
        subtitle="Overview of financial data" 
      />

      <div className="grid grid-cols-1 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Finance Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">No data available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Finance;
