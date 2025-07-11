
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="pb-16">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your PG settings"
      />
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>PG Details</CardTitle>
            <CardDescription>Basic information about your PG</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pgName">PG Name</Label>
              <Input id="pgName" defaultValue="Sunrise PG Accommodations" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pgAddress">Address</Label>
              <Input id="pgAddress" defaultValue="123 Main Street, Koramangala, Bangalore" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pgContact">Contact Number</Label>
              <Input id="pgContact" defaultValue="+91 9876543210" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="rent-reminder">Rent Reminders</Label>
                <p className="text-sm text-muted-foreground">
                  Send reminders to tenants about upcoming rent payments
                </p>
              </div>
              <Switch id="rent-reminder" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="new-booking">New Bookings</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a new tenant books a bed
                </p>
              </div>
              <Switch id="new-booking" defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="resource-alert">Low Resource Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when resources are running low
                </p>
              </div>
              <Switch id="resource-alert" defaultChecked />
            </div>
            
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@easypg.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
