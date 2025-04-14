import {
  Role,
  PaymentMethodType,
  OrderStatus,
  VoucherType,
  VoucherCategory,
} from '@prisma/client';

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
  excerpt: string;
  description: string;
}

export interface BankAccount {
  name: string;
  number: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}
export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
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
  CategoryProduct: CategoryProduct;
  product: ProductDetails;
}

export interface CategoryProduct {
  Category: Category;
}

export interface ProductDetails {
  id: number;
  name: string;
  excerpt: string;
  description: string;
  slug: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  ProductImages: ProductImage[];
}

/* -------------------------------------------------------------------------- */
/*                                 STORE TYPES                              */
/* -------------------------------------------------------------------------- */

export interface Store {
  id: number;
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

/* -------------------------------------------------------------------------- */
/*                                 USER TYPES                               */
/* -------------------------------------------------------------------------- */

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  profileImage: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  StoreUser: {
    storeId: number;
  }[];
}

/* -------------------------------------------------------------------------- */
/*                                 VOUCHER TYPES                            */
/* -------------------------------------------------------------------------- */

export interface Voucher {
  id: number;
  name: string;
  description: string;
  code: string;
  voucherType: VoucherType;
  value: number;
  startDate: string;
  endDate: string;
  stock: number;
  isActive: boolean;
  voucherImage: string;
  voucherCategory: VoucherCategory;
  VoucherUser: VoucherUser[];
}

export interface VoucherUser {
  id: number;
  userId: number;
  voucherId: number;
  createdAt: string;
  updatedAt: string;
  stockCustomer: number;
}

/* -------------------------------------------------------------------------- */
/*                                 ORDER TYPES                              */
/* -------------------------------------------------------------------------- */

export interface Order {
  id: number;
  userId: number;
  storeId: number;
  shippingAddressId: number;
  slug: string;
  paymentMethodType: PaymentMethodType;
  totalAmount: number;
  status: OrderStatus;
  paymentProof?: string;
  paymentProofUploadedAt?: Date;
  orderConfirmationAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  shippingAt?: Date;
  deliveredAt?: Date;
  shippingInformation?: ShippingInformation;
  orderItems: OrderItem[];
  user: User;
}

export interface OrderItem {
  id: number;
  orderId: number;
  storeProductId: number;
  productId: number;
  quantity: number;
  price: number;
  total: number;
  storeProduct: StoreProduct;
}

export interface StoreProduct {
  id: number;
  name: string;
  product: ProductDetails;
}

/* -------------------------------------------------------------------------- */
/*                                 SHIPPING TYPES                           */
/* -------------------------------------------------------------------------- */

export interface ShippingInformation {
  id: number;
  orderId: number;
  courierName: string;
  code: string;
  serviceType: string;
  description: string;
  shippingCost: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

/* -------------------------------------------------------------------------- */
/*                                 CART TYPES                               */
/* -------------------------------------------------------------------------- */

export interface Cart {
  id: number;
  userId: number;
  storeId: number;
  cartItems: CartItem[];
  CartValueCalculation: CartValueCalculation;
}

export interface CartValueCalculation {
  id: number;
  totalAmountCart: number;
  totalAmountCartAfterVoucher: number;
  valueVoucherCart: number;
  shippingCost: number;
  shippingCostAfterVoucher: number;
  valueVoucherShipping: number;
}

export interface CartItem {
  id: number;
  productId: number;
  cartId: number;
  quantity: number;
  price: number;
  total: number;
  storeProduct: StoreProduct;
}

/* -------------------------------------------------------------------------- */
/*                                 SHIPPING COST TYPES                      */
/* -------------------------------------------------------------------------- */

export interface ShippingCost {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface ShippingInformation {
  courierName: string;
  code: string;
  serviceType: string;
  description: string;
  shippingCost: number;
  estimatedTime: number;
}

/* -------------------------------------------------------------------------- */
/*                                 CHEAP PRODUCTS TYPES                     */
/* -------------------------------------------------------------------------- */

export interface CheapProducts {
  id: number;
  storeId: number;
  name: string;
  productId: number;
  stock: number;
  price: number;
  isCheap: boolean;
  createdAt: string;
  updatedAt: string;
  product: ProductDetails;
}

/* -------------------------------------------------------------------------- */
/*                                 STORE CONTEXT TYPES                      */
/* -------------------------------------------------------------------------- */

export interface StoreContextType {
  nearestStore: Store | null;
  setNearestStore: React.Dispatch<React.SetStateAction<Store | null>>;
  products: Product[];
  cheapProducts: CheapProducts[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  user: User | null;
  storeStoreAdmin: Store | null;
  handleLogout: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 PRODUCT ITEM PROPS TYPES                  */
/* -------------------------------------------------------------------------- */

export interface ProductItemProps {
  name: string;
  imageUrl: string;
  price: number;
  excerpt: string;
  stock: number;
}
