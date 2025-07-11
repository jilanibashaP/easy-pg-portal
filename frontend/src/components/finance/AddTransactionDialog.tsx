
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TransactionType, TransactionCategory } from "@/models/types";
import { createExpense } from '@/api/expenseApi';
import { createPayment } from '@/api/paymentApi';

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be a positive number"),
  type: z.nativeEnum(TransactionType),
  category: z.nativeEnum(TransactionCategory),
  date: z.string().min(1, "Date is required"),
});

type AddTransactionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [selectedForm, setSelectedForm] = React.useState<'income' | 'expense' | 'both'>('both');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      type: TransactionType.INCOME,
      category: TransactionCategory.RENT,
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Update the category options based on the selected transaction type
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        // Reset category when type changes
        form.setValue('category', value.type === TransactionType.INCOME ? 
          TransactionCategory.RENT : TransactionCategory.UTILITY);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (values.type === TransactionType.EXPENSE) {
        await createExpense({
          amount: values.amount as number,
          category: values.category as any,
          description: values.description as string,
          date: values.date as string,
        });
      } else if (values.type === TransactionType.INCOME) {
        await createPayment({
          paidAmount: values.amount as number,
          notes: values.description as string,
          paidDate: values.date as string,
        });
      }
      toast({
        title: "Transaction added successfully",
        description: `${values.type} transaction of ₹${values.amount} has been added.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error adding transaction",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of the new transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 mb-4">
          <Button variant={selectedForm === 'both' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedForm('both')}>Both</Button>
          <Button variant={selectedForm === 'income' ? 'default' : 'outline'} size="sm" onClick={() => { setSelectedForm('income'); form.setValue('type', TransactionType.INCOME); }}>Income</Button>
          <Button variant={selectedForm === 'expense' ? 'default' : 'outline'} size="sm" onClick={() => { setSelectedForm('expense'); form.setValue('type', TransactionType.EXPENSE); }}>Expense</Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {(selectedForm === 'both' || selectedForm === 'income' || selectedForm === 'expense') && selectedForm === 'both' && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(TransactionType).map((type: string) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(TransactionCategory).map((category: string) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter transaction details" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
