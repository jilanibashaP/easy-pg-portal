
// import React from 'react';
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { ResourceCategory } from "@/models/types";
// import { RESOURCES_DATA } from "@/api/data";

// const formSchema = z.object({
//   name: z.string().min(1, "Resource name is required"),
//   category: z.nativeEnum(ResourceCategory),
//   quantity: z.coerce.number().int().positive("Quantity must be a positive number"),
//   availableQuantity: z.coerce.number().int().min(0, "Available quantity must be at least 0"),
// });

// type AddResourceDialogProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// };

// export default function AddResourceDialog({ open, onOpenChange }: AddResourceDialogProps) {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       category: ResourceCategory.OTHER,
//       quantity: 1,
//       availableQuantity: 1,
//     },
//   });

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       // In a real app, this would be an API call
//       const newResource = {
//         id: `resource-${Date.now()}`,
//         name: values.name,
//         category: values.category,
//         quantity: values.quantity,
//         availableQuantity: values.availableQuantity,
//         lastRestocked: new Date().toISOString(),
//       };

//       // Add the new resource to the RESOURCES_DATA array
//       RESOURCES_DATA.push(newResource);
      
//       toast({
//         title: "Resource added successfully",
//         description: `${values.name} has been added to the system.`,
//       });
      
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       toast({
//         title: "Error adding resource",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Resource</DialogTitle>
//           <DialogDescription>
//             Fill in the details to add a new resource to the system.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Resource Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g. Bed Sheets" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <FormField
//               control={form.control}
//               name="category"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Category</FormLabel>
//                   <Select onValueChange={field.onChange} defaultValue={field.value}>
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select category" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {Object.values(ResourceCategory).map((category) => (
//                         <SelectItem key={category} value={category}>{category}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <div className="grid grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="quantity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Total Quantity</FormLabel>
//                     <FormControl>
//                       <Input type="number" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
              
//               <FormField
//                 control={form.control}
//                 name="availableQuantity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Available</FormLabel>
//                     <FormControl>
//                       <Input type="number" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
            
//             <DialogFooter>
//               <Button type="submit">Add Resource</Button>
//             </DialogFooter>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
