
// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Resource } from "@/models/types";
// import { Badge } from "@/components/ui/badge";

// interface ResourceCardProps {
//   resource: Resource;
//   onClick?: () => void;
// }

// const ResourceCard = ({ resource, onClick }: ResourceCardProps) => {
//   const availabilityPercentage = (resource.availableQuantity / resource.quantity) * 100;
  
//   const getAvailabilityStatusColor = () => {
//     if (availabilityPercentage <= 20) return 'bg-pgDanger';
//     if (availabilityPercentage <= 50) return 'bg-pgWarning';
//     return 'bg-pgSuccess';
//   };

//   return (
//     <Card 
//       className="h-full transition-all hover:shadow-md cursor-pointer"
//       onClick={onClick}
//     >
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-lg">{resource.name}</CardTitle>
//           <Badge>{resource.category}</Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           <div className="space-y-1">
//             <div className="flex justify-between text-sm">
//               <span>Availability</span>
//               <span className="font-medium">{resource.availableQuantity}/{resource.quantity} units</span>
//             </div>
//             <div className="h-2 w-full bg-gray-100 rounded-full">
//               <div 
//                 className={`h-2 ${getAvailabilityStatusColor()} rounded-full`}
//                 style={{ width: `${availabilityPercentage}%` }}
//               />
//             </div>
//           </div>
          
//           <div className="flex justify-between items-center text-sm">
//             <span className="text-muted-foreground">Last Restocked</span>
//             <span>{new Date(resource.lastRestocked).toLocaleDateString()}</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ResourceCard;
