import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ROOMS_DATA } from '@/api/data';
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNumber: z.string().min(10, { message: "Phone number must be valid." }),
  roomId: z.string({required_error: "Please select a room."}),
  bedNumber: z.string({required_error: "Please select a bed."})
    .transform((val) => parseInt(val, 10)), // Transform string to number
  joiningDate: z.string(),
  rentDueDate: z.string().transform((val) => parseInt(val, 10)).refine((val) => val >= 1 && val <= 31, {
    message: "Rent due date must be between 1 and 31."
  })
});

type AddTenantFormValues = z.infer<typeof formSchema>;

interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddTenantDialog = ({ open, onOpenChange }: AddTenantDialogProps) => {
  const form = useForm<AddTenantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      joiningDate: new Date().toISOString().split('T')[0],
      rentDueDate: "5"
    }
  });
  
  const selectedRoomId = form.watch("roomId");
  const selectedRoom = ROOMS_DATA.find(room => room.id === selectedRoomId);
  
  const availableBeds = [];
  if (selectedRoom) {
    const occupiedBeds = selectedRoom.occupiedBeds;
    const totalBeds = selectedRoom.totalBeds;
    
    for (let i = 1; i <= totalBeds; i++) {
      if (i > occupiedBeds) { // Only show beds that aren't occupied
        availableBeds.push(i);
      }
    }
  }

  const onSubmit = (data: AddTenantFormValues) => {
    // In a real application, this would be an API call
    console.log("Tenant data:", data);
    
    toast.success("Tenant added successfully!", {
      description: `${data.name} has been added as a tenant.`
    });
    
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Tenant</DialogTitle>
          <DialogDescription>
            Enter the details of the new tenant. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROOMS_DATA
                          .filter(room => room.occupiedBeds < room.totalBeds)
                          .map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} ({room.occupiedBeds}/{room.totalBeds} beds occupied)
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bedNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Number</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value?.toString() || undefined}
                      disabled={!selectedRoomId || availableBeds.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableBeds.map(bedNumber => (
                          <SelectItem key={bedNumber} value={bedNumber.toString()}>
                            Bed {bedNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="joiningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rentDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rent Due Date (Day of Month)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="31" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Add Tenant</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTenantDialog;
