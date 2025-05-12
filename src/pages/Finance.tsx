
import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
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
      
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">May 2023</p>
                  <p className="text-sm text-muted-foreground">Income: ₹24,000</p>
                  <p className="text-sm text-muted-foreground">Expenses: ₹13,500</p>
                </div>
                <p className="font-medium text-green-600">Net: ₹10,500</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">April 2023</p>
                  <p className="text-sm text-muted-foreground">Income: ₹22,500</p>
                  <p className="text-sm text-muted-foreground">Expenses: ₹15,000</p>
                </div>
                <p className="font-medium text-green-600">Net: ₹7,500</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">March 2023</p>
                  <p className="text-sm text-muted-foreground">Income: ₹21,000</p>
                  <p className="text-sm text-muted-foreground">Expenses: ₹18,000</p>
                </div>
                <p className="font-medium text-green-600">Net: ₹3,000</p>
              </div>
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
