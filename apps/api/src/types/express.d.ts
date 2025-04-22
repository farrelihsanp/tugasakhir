import { Order } from '@/types/types';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJWTPayload extends JwtPayload {
  id: number;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomJWTPayload | null;
    }
  }
}

export interface UserData {
  name?: string;
  username?: string;
  profileImage?: string;
  password?: string;
  email?: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: number;
  number: number;
  country: string;
  isPrimary: boolean;
}

export interface UpdateProductData {
  id?: number;
  name?: string;
  excerpt?: string;
  description?: string;
  price?: number;
  slug?: string;
  stock?: number;
  isCheap?: boolean;
  categoryIds?: number[];
  productImage?: string;
}

export interface OrderStatusData {
  order_id: number;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraudStatus: string;
}

export interface Product {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  description: string;
  excerpt: string;
  date: Date;
  weight: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  storeId: number;
  shippingAddressId: number;
  slug: string;
  paymentMethodType: string;
  totalAmount: number;
  status: string;
  paymentProof?: string;
  paymentProofUploadedAt?: Date;
  orderConfirmationAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  shippingAt?: Date;
  deliveredAt?: Date;
  acceptedProcessByAdmin: boolean;
  acceptedProcessByCustomers: boolean;
}
