import { Role } from '@prisma/client';

export interface StoreData {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
  latitude: number;
  longitude: number;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  maxServiceDistance: number;
  isPrimary: boolean;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  excerpt: string;
}

export interface Product {
  id: number;
  storeId: number;
  name: string;
  description: string;
  productId: number;
  stock: number;
  price: number;
  isCheap: boolean;
  createdAt: string;
  updatedAt: string;
  CategoryProduct: {
    Category: {
      id: number;
      name: string;
      image: string;
      slug: string;
      excerpt: string;
    };
  };
  product: {
    id: number;
    name: string;
    excerpt: string;
    description: string;
    slug: string;
    weight: number;
    createdAt: string;
    updatedAt: string;
    ProductImages: {
      id: number;
      productId: number;
      imageUrl: string;
    }[];
  };
}

export interface cheapProducts {
  id: number;
  storeId: number;
  name: string;
  productId: number;
  stock: number;
  price: number;
  isCheap: boolean;
  createdAt: string;
  updatedAt: string;
  product: {
    id: number;
    name: string;
    excerpt: string;
    description: string;
    slug: string;
    weight: number;
    createdAt: string;
    updatedAt: string;
    ProductImages: {
      id: number;
      productId: number;
      imageUrl: string;
    }[];
  };
}

export interface StoreContextType {
  nearestStore: Store | null;
  setNearestStore: React.Dispatch<React.SetStateAction<Store | null>>;
  products: Product[];
  cheapProducts: cheapProducts[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  user: User | null;
  handleLogout: () => void;
}

export interface ProductItemProps {
  name: string;
  imageUrl: string;
  price: number;
  excerpt: string;
  stock: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  profileImage: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export type Voucher = {
  id: number;
  name: string;
  description: string;
  code: string;
  voucherType: 'PERCENTAGE' | 'AMOUNT';
  value: number;
  startDate: string;
  endDate: string;
  stock: number;
  isActive: boolean;
  voucherImage: string;
  VoucherUser: {
    id: number;
    userId: number;
    voucherId: number;
    createdAt: string;
    updatedAt: string;
    stockCustomer: number;
  }[];
};
