import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Banknote, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import { getDashboardSummary } from '@/api/dashboardApi';
// import { ROOMS_DATA } from '@/api/data';
import { Room } from '@/models/types';

import { fetchRooms } from '@/api/roomApi';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await getDashboardSummary();
      setSummary(data);
    };
    fetchSummary();
  }, []);

  // rooms data useEffect to fetch the rooms data
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    const getRooms = async () => {
      const roomsData = await fetchRooms();
      setRooms(roomsData);
    };
    getRooms();
  }, []);

  // Generate occupancy data for last 7 days
  const occupancyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    return {
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      occupancy: summary
        ? Math.floor(Math.random() * (summary.occupancyRate + 10 - (summary.occupancyRate - 10)) + (summary.occupancyRate - 10))
        : 0
    };
  });

  // Get available rooms
  const availableRooms = rooms.filter(room => room.occupiedBeds < room.totalBeds);

  const navigateTo = (path: string) => {
    navigate(path);
  };

  if (!summary) {
    return <div className="p-8 text-center text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="pb-16">
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to Easy PG Manager"
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div onClick={() => navigateTo('/rooms')} className="cursor-pointer">
          <StatCard
            title="Total Rooms"
            value={summary.totalRooms}
            icon={<Home />}
          />
        </div>
        <div onClick={() => navigateTo('/rooms')} className="cursor-pointer">
          <StatCard
            title="Occupancy Rate"
            value={`${summary.occupancyRate}%`}
            icon={<Percent />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
        <div onClick={() => navigateTo('/tenants')} className="cursor-pointer">
          <StatCard
            title="Total Tenants"
            value={summary.totalTenants}
            icon={<Users />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>
        <div onClick={() => navigateTo('/tenants')} className="cursor-pointer">
          <StatCard
            title="Pending Dues"
            value={summary.pendingDues}
            icon={<Banknote />}
            trend={{ value: 2, isPositive: false }}
          />
        </div>
      </div>
      
      {/* Available Rooms Section */}
      <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/rooms')}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Rooms</CardTitle>
            <CardDescription>
              {availableRooms.length} rooms with vacant beds
            </CardDescription>
          </div>
          <Home className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableRooms.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No available rooms at the moment.
              </div>
            ) : (
              availableRooms.slice(0, 3).map(room => (
                <div key={room.id} className="flex justify-between items-center p-3 rounded-lg border hover:bg-accent/50">
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">{room.type}, Floor {room.floor}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="bg-green-50">
                      {room.totalBeds - room.occupiedBeds} Beds Available
                    </Badge>
                    <p className="text-sm font-medium mt-1">₹{room.monthlyRent}/month</p>
                  </div>
                </div>
              ))
            )}
            {availableRooms.length > 3 && (
              <div className="text-center">
                <button 
                  onClick={() => navigateTo('/rooms')} 
                  className="text-sm text-primary hover:underline"
                >
                  View all {availableRooms.length} available rooms
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Occupancy Overview */}
      <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/stats')}>
        <CardHeader>
          <CardTitle>Occupancy Overview</CardTitle>
          <CardDescription>
            Total beds: {summary.totalBeds}, Occupied: {summary.occupiedBeds}, Vacant: {summary.vacantBeds}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Bar
                  dataKey="occupancy"
                  fill="#9b87f5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activities */}
      <Card className="mb-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo('/tenants')}>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest updates in your PG</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium">New tenant check-in</p>
                <p className="text-sm text-muted-foreground">Sarah Williams checked in to Room 202</p>
              </div>
              <p className="text-sm text-muted-foreground">Today, 10:30 AM</p>
            </div>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="font-medium">Payment received</p>
                <p className="text-sm text-muted-foreground">₹8,000 received from John Doe</p>
              </div>
              <p className="text-sm text-muted-foreground">Yesterday</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
