export type Role = "DRIVER" | "VYAPARI" | "FARMER";
export type PostType = "VEHICLE_AVAILABLE" | "LOAD_AVAILABLE";

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: Role;
  vehicleNumber?: string | null;
  vehicleType?: string | null;
  city: string;
  isVerified: boolean;
  rating: number;
  hasActivePass: boolean;
  avatar?: string | null;
}

export interface PostItem {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  origin: string;
  destination: string;
  vehicleType: string;
  capacity?: string | null;
  targetPrice?: number | null;
  departureTime: string;
  notes?: string | null;
  status: string;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    phone: string;
    role: Role;
    vehicleNumber?: string | null;
    city: string;
    isVerified: boolean;
    rating: number;
    hasActivePass: boolean;
  };
}
