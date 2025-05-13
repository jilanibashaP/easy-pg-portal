
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Plus, Search, Filter, WalletCards, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TRANSACTIONS_DATA, getFinancialSummary } from '@/api/data';
import { Transaction, TransactionType, TransactionCategory } from '@/models/types';
import AddTransactionDialog from '@/components/finance/AddTransactionDialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const Finance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState('monthly');

  const financialSummary = getFinancialSummary();

  const filteredTransactions = TRANSACTIONS_DATA.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'income' && transaction.type === TransactionType.INCOME) ||
                      (activeTab === 'expense' && transaction.type === TransactionType.EXPENSE);
    return matchesSearch && matchesTab;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const monthlyData = Array.from({ length: 12 }, (_, month) => {
    const date = new Date(new Date().getFullYear(), month, 1);
    const monthName = date.toLocaleString('default', { month: 'short' });

    const income = filteredTransactions
      .filter(t => new Date(t.date).getMonth() === month && t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTransactions
      .filter(t => new Date(t.date).getMonth() === month && t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return { name: monthName, income, expenses, profit: income - expenses };
  });

  // Chart configurations for consistent colors
  const chartConfig = {
    income: { color: '#22c55e' },
    expenses: { color: '#ef4444' },
    profit: { color: '#9b87f5' },
    rent: { color: '#3b82f6' },
    utility: { color: '#f59e0b' },
    salary: { color: '#ec4899' },
    maintenance: { color: '#8b5cf6' },
    supplies: { color: '#14b8a6' },
    food: { color: '#f97316' },
    other: { color: '#6b7280' }
  };

  // Data for expense breakdown chart
  const expenseData = Object.entries(financialSummary.expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
    color: chartConfig[category.toLowerCase()]?.color || '#6b7280'
  }));

  // Custom tooltip renderer for pie chart
  const renderCustomPieTooltip = (props) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0].payload;
      return (
        <div className="bg-background p-2 border rounded-md shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">₹{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-16">
      <PageHeader title="Finance" subtitle="Track income, expenses and manage your finances" action={<Button size="sm" onClick={() => setAddDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Transaction</Button>} />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">₹{financialSummary.totalIncome.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">₹{financialSummary.totalExpenses.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{financialSummary.netProfit.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Income vs Expenses Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the current year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={(props) => {
                      if (props.active && props.payload && props.payload.length) {
                        return (
                          <div className="bg-background p-2 border rounded-md shadow-md">
                            <p className="font-medium">{props.label}</p>
                            {props.payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: ₹{entry.value.toLocaleString()}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill={chartConfig.income.color} />
                  <Bar dataKey="expenses" name="Expenses" fill={chartConfig.expenses.color} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Where your money is going</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ChartContainer config={chartConfig} className="w-full max-w-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderCustomPieTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <div className="flex items-center space-x-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expenses</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
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
                    <TableCell colSpan={4} className="text-center py-6">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === TransactionType.INCOME ? "outline" : "secondary"}>
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        transaction.type === TransactionType.INCOME ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === TransactionType.INCOME ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddTransactionDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default Finance;
