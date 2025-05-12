
import { Room, Tenant, Resource, ResourceCategory, RoomType } from '@/models/types';

export const ROOMS_DATA: Room[] = [
  {
    id: '1',
    name: 'Room 101',
    type: RoomType.DOUBLE,
    floor: 1,
    totalBeds: 2,
    occupiedBeds: 1,
    amenities: ['AC', 'Attached Bathroom', 'Balcony'],
    monthlyRent: 8000,
  },
  {
    id: '2',
    name: 'Room 102',
    type: RoomType.TRIPLE,
    floor: 1,
    totalBeds: 3,
    occupiedBeds: 3,
    amenities: ['AC', 'Attached Bathroom'],
    monthlyRent: 7000,
  },
  {
    id: '3',
    name: 'Room 201',
    type: RoomType.SINGLE,
    floor: 2,
    totalBeds: 1,
    occupiedBeds: 0,
    amenities: ['Attached Bathroom', 'Study Table'],
    monthlyRent: 10000,
  },
  {
    id: '4',
    name: 'Room 202',
    type: RoomType.QUAD,
    floor: 2,
    totalBeds: 4,
    occupiedBeds: 2,
    amenities: ['Shared Bathroom', 'Balcony'],
    monthlyRent: 6000,
  },
  {
    id: '5',
    name: 'Room 301',
    type: RoomType.DOUBLE,
    floor: 3,
    totalBeds: 2,
    occupiedBeds: 1,
    amenities: ['AC', 'Shared Bathroom', 'WiFi'],
    monthlyRent: 9000,
  }
];

export const TENANTS_DATA: Tenant[] = [
  {
    id: '1',
    name: 'John Doe',
    contactNumber: '+91 9876543210',
    email: 'john@example.com',
    roomId: '1',
    bedNumber: 1,
    joiningDate: '2023-01-15',
    rentDueDate: 15,
    advanceAmount: 8000,
  },
  {
    id: '2',
    name: 'Jane Smith',
    contactNumber: '+91 9876543211',
    email: 'jane@example.com',
    roomId: '2',
    bedNumber: 1,
    joiningDate: '2023-03-01',
    rentDueDate: 1,
    advanceAmount: 7000,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    contactNumber: '+91 9876543212',
    email: 'mike@example.com',
    roomId: '2',
    bedNumber: 2,
    joiningDate: '2023-02-10',
    rentDueDate: 10,
    advanceAmount: 7000,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    contactNumber: '+91 9876543213',
    email: 'sarah@example.com',
    roomId: '2',
    bedNumber: 3,
    joiningDate: '2023-04-05',
    rentDueDate: 5,
    advanceAmount: 7000,
  },
  {
    id: '5',
    name: 'Alex Brown',
    contactNumber: '+91 9876543214',
    email: 'alex@example.com',
    roomId: '4',
    bedNumber: 1,
    joiningDate: '2023-01-20',
    rentDueDate: 20,
    advanceAmount: 6000,
  },
  {
    id: '6',
    name: 'Emily Davis',
    contactNumber: '+91 9876543215',
    email: 'emily@example.com',
    roomId: '4',
    bedNumber: 2,
    joiningDate: '2023-03-15',
    rentDueDate: 15,
    advanceAmount: 6000,
  },
];

export const RESOURCES_DATA: Resource[] = [
  {
    id: '1',
    name: 'Bed Sheets',
    category: ResourceCategory.BEDDING,
    quantity: 30,
    availableQuantity: 12,
    lastRestocked: '2023-04-10',
  },
  {
    id: '2',
    name: 'Towels',
    category: ResourceCategory.BEDDING,
    quantity: 24,
    availableQuantity: 8,
    lastRestocked: '2023-03-25',
  },
  {
    id: '3',
    name: 'Water Purifier',
    category: ResourceCategory.KITCHEN,
    quantity: 3,
    availableQuantity: 3,
    lastRestocked: '2023-01-15',
  },
  {
    id: '4',
    name: 'Washing Machine',
    category: ResourceCategory.OTHER,
    quantity: 2,
    availableQuantity: 2,
    lastRestocked: '2023-02-01',
  },
  {
    id: '5',
    name: 'Study Tables',
    category: ResourceCategory.FURNITURE,
    quantity: 10,
    availableQuantity: 4,
    lastRestocked: '2022-12-20',
  },
];

export const getDashboardSummary = () => {
  const totalRooms = ROOMS_DATA.length;
  let totalBeds = 0;
  let occupiedBeds = 0;
  
  ROOMS_DATA.forEach(room => {
    totalBeds += room.totalBeds;
    occupiedBeds += room.occupiedBeds;
  });
  
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);
  
  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    vacantBeds: totalBeds - occupiedBeds,
    occupancyRate,
    totalTenants: TENANTS_DATA.length,
    pendingDues: TENANTS_DATA.filter(t => t.rentDueDate < new Date().getDate()).length,
  };
};
