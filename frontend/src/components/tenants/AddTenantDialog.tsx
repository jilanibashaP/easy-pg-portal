
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from 'react';
import { fetchRooms } from '@/api/roomApi';
import { fetchTenants, createTenant } from '@/api/tenantApi';
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  contactNumber: z.string().min(10, { message: "Phone number must be valid." }),
  roomId: z.string({required_error: "Please select a room."}),
  bedNumber: z.coerce.number({required_error: "Please select a bed."}),
  joiningDate: z.string(),
  rentDueDate: z.string().transform((val) => parseInt(val, 10)).refine((val) => val >= 1 && val <= 31, {
    message: "Rent due date must be between 1 and 31."
  }),
  pgId: z.string({ required_error: "PG ID is required." })
});

type AddTenantFormValues = z.infer<typeof formSchema>;

import { Room } from '@/models/types';
interface AddTenantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTenantAdded?: (tenant: any) => void;
  room?: Room | null;
}

const AddTenantDialog = ({ open, onOpenChange, onTenantAdded, room }: AddTenantDialogProps) => {
  const form = useForm<AddTenantFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      roomId: room?.id || '',
      joiningDate: new Date().toISOString().split('T')[0],
      rentDueDate: 5,
      pgId: "1a2b3c4d-1234-5678-9101-abcdefabcdef"
    }
  });

  // If the dialog is opened for a different room, update the roomId field
  React.useEffect(() => {
    if (room && open) {
      form.setValue('roomId', room.id);
    }
  }, [room, open]);
  
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [tenants, setTenants] = useState([]);
  useEffect(() => {
    fetchRooms().then(data => {
      setRooms(data);
      setLoadingRooms(false);
    });
    fetchTenants().then(data => setTenants(data));
  }, []);

  const selectedRoomId = form.watch("roomId");
  const selectedRoom = rooms.find(room => room.id === selectedRoomId);

  // Find beds that are not occupied by any tenant in this room
  let availableBeds: number[] = [];
  if (selectedRoom) {
    const totalBeds = selectedRoom.totalBeds;
    // Find all bed numbers already taken in this room
    const takenBeds = tenants
      .filter((tenant: any) => tenant.roomId === selectedRoomId)
      .map((tenant: any) => tenant.bedNumber);
    for (let i = 1; i <= totalBeds; i++) {
      if (!takenBeds.includes(i)) {
        availableBeds.push(i);
      }
    }
  }

  const onSubmit = async (data: AddTenantFormValues) => {
    try {
      const newTenant = await createTenant({ ...data, pgId: "1a2b3c4d-1234-5678-9101-abcdefabcdef" });
      if (onTenantAdded) {
        onTenantAdded(newTenant);
      }
      toast.success("Tenant added successfully!", {
        description: `${data.name} has been added as a tenant.`
      });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Failed to add tenant", { description: error.message || 'An error occurred.' });
    }
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
                      value={field.value}
                      disabled={!!room}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms
                          .filter((r: any) => {
                            // Only show rooms with at least one available bed
                            const takenBeds = tenants.filter((tenant: any) => tenant.roomId === r.id).map((tenant: any) => tenant.bedNumber);
                            return takenBeds.length < r.totalBeds;
                          })
                          .map((r: any) => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.name} ({r.totalBeds - tenants.filter((tenant: any) => tenant.roomId === r.id).length}/{r.totalBeds} beds vacant)
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
                      onValueChange={(value) => field.onChange(Number(value))} 
                      value={field.value?.toString()}
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
