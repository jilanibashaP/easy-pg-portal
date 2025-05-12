
export interface Room {
  id: string;
  name: string;
  type: RoomType;
  floor: number;
  totalBeds: number;
  occupiedBeds: number;
  amenities: string[];
  monthlyRent: number;
}

export interface Tenant {
  id: string;
  name: string;
  contactNumber: string;
  email: string;
  roomId: string;
  bedNumber: number;
  joiningDate: string;
  rentDueDate: number;
  advanceAmount: number;
}

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  quantity: number;
  availableQuantity: number;
  lastRestocked: string;
}

export enum RoomType {
  SINGLE = "Single",
  DOUBLE = "Double",
  TRIPLE = "Triple",
  QUAD = "Quad"
}

export enum ResourceCategory {
  FURNITURE = "Furniture",
  KITCHEN = "Kitchen",
  BEDDING = "Bedding",
  CLEANING = "Cleaning",
  OTHER = "Other"
}

export interface DashboardSummary {
  totalRooms: number;
  occupancyRate: number;
  totalTenants: number;
  pendingDues: number;
}
