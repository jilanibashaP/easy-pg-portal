
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { ROOMS_DATA, TRANSACTIONS_DATA } from '@/api/data';
import { TransactionType } from '@/models/types';
import { InfoIcon } from 'lucide-react';
import { TooltipProvider, Tooltip as TooltipUI, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const Stats = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");

  // Calculate occupancy data
  const totalRooms = ROOMS_DATA.length;
  const occupiedRooms = ROOMS_DATA.filter(room => room.occupiedBeds > 0).length;
  const vacantRooms = totalRooms - occupiedRooms;
  const maintenanceRooms = ROOMS_DATA.filter(room => room.occupiedBeds === 0 && room.totalBeds > 0).length;

  const occupancyData = [
    { name: 'Occupied', value: occupiedRooms, color: '#9b87f5' },
    { name: 'Vacant', value: vacantRooms - maintenanceRooms, color: '#22c55e' },
    { name: 'Maintenance', value: maintenanceRooms, color: '#f59e0b' },
  ];

  // Generate monthly revenue data
  const generateMonthlyData = () => {
    const monthlyData = [];
    const currentYear = new Date().getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      const monthTransactions = TRANSACTIONS_DATA.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() === month && 
               transactionDate.getFullYear() === currentYear;
      });
      
      const income = monthTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        name: monthName,
        revenue: income,
        expenses: expenses,
        profit: income - expenses
      });
    }
    
    return monthlyData;
  };

  // Generate yearly data
  const generateYearlyData = () => {
    const yearlyData = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < 5; i++) {
      const year = currentYear - 4 + i;
      
      const yearTransactions = TRANSACTIONS_DATA.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getFullYear() === year;
      });
      
      const income = yearTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
        
      const expenses = yearTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      
      yearlyData.push({
        name: year.toString(),
        revenue: income,
        expenses: expenses,
        profit: income - expenses
      });
    }
    
    return yearlyData;
  };

  const monthlyData = generateMonthlyData();
  const yearlyData = generateYearlyData();
  
  // Expense breakdown by category
  const calculateExpenseBreakdown = () => {
    const expensesByCategory = {};
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    TRANSACTIONS_DATA
      .filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === TransactionType.EXPENSE && 
               transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      })
      .forEach(t => {
        if (!expensesByCategory[t.category]) {
          expensesByCategory[t.category] = 0;
        }
        expensesByCategory[t.category] += t.amount;
      });
      
    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      value: amount
    }));
  };
  
  const expenseBreakdownData = calculateExpenseBreakdown();
  
  // Colors for charts
  const COLORS = ['#9b87f5', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

  return (
    <div className="pb-16">
      <PageHeader 
        title="Statistics" 
        subtitle="Visual insights for your PG management"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex items-center space-x-2">
              <Tabs defaultValue={timeFrame} value={timeFrame} onValueChange={setTimeFrame}>
                <TabsList className="grid grid-cols-2 h-8">
                  <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="text-xs">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeFrame === "monthly" ? monthlyData : yearlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border/50 bg-background p-2 shadow-md">
                            <p className="font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-green-600">
                              Revenue: ₹{payload[0].value?.toLocaleString()}
                            </p>
                            <p className="text-sm text-red-500">
                              Expenses: ₹{payload[1].value?.toLocaleString()}
                            </p>
                            <p className="text-sm font-medium">
                              Profit: ₹{payload[2].value?.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="profit" fill="#9b87f5" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Occupancy</CardTitle>
            <CardDescription>Distribution of room status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border/50 bg-background p-2 shadow-md">
                            <p className="font-medium">{data.name} rooms</p>
                            <p className="text-sm">{data.value} of {totalRooms} rooms</p>
                            <p className="text-sm">{((data.value / totalRooms) * 100).toFixed(0)}% of total</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-medium">Total Rooms</p>
                <p className="text-2xl font-bold">{totalRooms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#9b87f5]">Occupied</p>
                <p className="text-2xl font-bold">{occupiedRooms}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-[#22c55e]">Vacant</p>
                <p className="text-2xl font-bold">{vacantRooms - maintenanceRooms}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Current month by category</CardDescription>
              </div>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>This chart shows where money is being spent this month.</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Growth</CardTitle>
                <CardDescription>Monthly trend analysis</CardDescription>
              </div>
              <TooltipProvider>
                <TooltipUI>
                  <TooltipTrigger asChild>
                    <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>This chart shows how revenue has grown over time.</p>
                  </TooltipContent>
                </TooltipUI>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#22c55e" activeDot={{ r: 8 }} name="Revenue" />
                  <Line type="monotone" dataKey="profit" stroke="#9b87f5" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Money In vs Money Out</CardTitle>
              <CardDescription>Monthly comparison for the current year</CardDescription>
            </div>
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Green line shows money coming in each month. Red line shows money going out. Purple line shows what's left (profit).</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeFrame === "monthly" ? monthlyData : yearlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-border/50 bg-background p-2 shadow-md">
                          <p className="font-medium">{payload[0].payload.name}</p>
                          <p className="text-sm text-green-600">
                            Money In: ₹{payload[0].value?.toLocaleString()}
                          </p>
                          <p className="text-sm text-red-500">
                            Money Out: ₹{payload[1].value?.toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-purple-500">
                            Left Over: ₹{payload[2].value?.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend formatter={value => value === "revenue" ? "Money In" : value === "expenses" ? "Money Out" : "Left Over"} />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} name="revenue" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="expenses" />
                <Line type="monotone" dataKey="profit" stroke="#9b87f5" strokeWidth={2} name="profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1 bg-green-500 rounded-sm"></span>
              <span>Money Coming In</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1 bg-red-500 rounded-sm"></span>
              <span>Money Going Out</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 mr-1 bg-purple-500 rounded-sm"></span>
              <span>What's Left Over</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
