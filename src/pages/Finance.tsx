
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Plus, Search, Filter, WalletCards, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TRANSACTIONS_DATA, getFinancialSummary } from '@/api/data';
import { Transaction, TransactionType, TransactionCategory } from '@/models/types';
import AddTransactionDialog from '@/components/finance/AddTransactionDialog';

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  const financialSummary = getFinancialSummary();
  
  // Filter transactions based on search and active tab
  const filteredTransactions = TRANSACTIONS_DATA.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
                          
    const matchesTab = activeTab === "all" || 
                      (activeTab === "income" && transaction.type === TransactionType.INCOME) ||
                      (activeTab === "expense" && transaction.type === TransactionType.EXPENSE);
                      
    return matchesSearch && matchesTab;
  });
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Prepare data for expense categories pie chart
  const expenseCategoriesData = Object.entries(financialSummary.expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount as number
  }));

  // Generate monthly data
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
        income: income,
        expenses: expenses,
        profit: income - expenses
      });
    }
    
    return monthlyData;
  };

  const monthlyData = generateMonthlyData();
  
  // Colors for pie chart
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#F97316', '#D946EF', '#0EA5E9', '#F2FCE2'];

  return (
    <div className="pb-16">
      <PageHeader 
        title="Finance" 
        subtitle="Track income, expenses and manage your finances"
        action={
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Transaction
          </Button>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Banknote className="mr-2 h-4 w-4 text-pgPurple" />
              <div className="text-2xl font-bold">₹{financialSummary.totalIncome.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <WalletCards className="mr-2 h-4 w-4 text-red-500" />
              <div className="text-2xl font-bold">₹{financialSummary.totalExpenses.toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <WalletCards className="mr-2 h-4 w-4 text-green-500" />
              <div className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                ₹{financialSummary.netProfit.toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly financial performance</CardDescription>
            </div>
            <Tabs defaultValue={timeFrame} value={timeFrame} onValueChange={setTimeFrame} className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">Yearly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#22c55e" />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                  <Line type="monotone" dataKey="profit" name="Profit" stroke="#9b87f5" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income Trend</CardTitle>
            <CardDescription>Monthly performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="profit" stroke="#9b87f5" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.type === TransactionType.INCOME
                                  ? 'bg-green-500/10 text-green-600 border-green-600'
                                  : 'bg-red-500/10 text-red-500 border-red-500'
                              }
                            >
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={
                                transaction.type === TransactionType.INCOME
                                  ? 'text-green-600'
                                  : 'text-red-500'
                              }
                            >
                              {transaction.type === TransactionType.INCOME ? '+' : '-'}
                              ₹{transaction.amount.toLocaleString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddTransactionDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default Finance;
