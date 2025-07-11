
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
import { RoomType } from "@/models/types";
import { fetchRooms, createRoom } from "@/api/roomApi";

const formSchema = z.object({
  name: z.string().min(1, "Room name is required"),
  type: z.nativeEnum(RoomType),
  floor: z.coerce.number().int().positive("Floor must be a positive number"),
  totalBeds: z.coerce.number().int().positive("Total beds must be a positive number"),
  monthlyRent: z.coerce.number().positive("Monthly rent must be a positive number"),
  amenities: z.string().min(1, "Amenities are required"),
});

type AddRoomDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: RoomType.SINGLE,
      floor: 1,
      totalBeds: 1,
      monthlyRent: 5000,
      amenities: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Use the real API to create a room
      const newRoom = {
        name: values.name,
        type: values.type,
        floor: values.floor,
        totalBeds: values.totalBeds,
        occupiedBeds: 0,
        amenities: values.amenities.split(",").map(item => item.trim()),
        monthlyRent: values.monthlyRent,
        pgId: "1a2b3c4d-1234-5678-9101-abcdefabcdef"
      };
      await createRoom(newRoom);
      toast({
        title: "Room added successfully",
        description: `Room ${values.name} has been added to the system.`,
      });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error adding room",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new room to the system.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Room 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(RoomType).map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Floor</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="totalBeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Beds</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="monthlyRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Rent (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AC, WiFi, Attached Bathroom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit">Add Room</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
