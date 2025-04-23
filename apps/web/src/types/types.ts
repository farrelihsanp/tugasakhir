import {
  Role,
  PaymentMethodType,
  OrderStatus,
  VoucherType,
  VoucherCategory,
  Provider,
  DiscountType,
} from '@prisma/client';

export interface DiscountReport {
  id: number;
  userId: number;
  customerBenefits: number;
  createdAt: string;
  User: User;
}
export interface StockData {
  id: number;
  productId: number;
  userId: number;
  storeId: number;
  stock: number;
  lastStock: number;
  difference: number;
  finalStock: number;
  typeOfChange: string;
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  password: string;
  email: string;
  profileImage: string;
  referralNumber: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
  referralCount: number;
  provider: Provider;
  isVerified: boolean;
  passwordConfirmed: boolean;
  proofOfPaymentImage?: string;
  storeId?: number;
  StoreUser: StoreUser[];
}

export interface StoreUser {
  id: number;
  userId: number;
  storeId: number;
  createdAt: string;
  updatedAt: string;
  store: Store;
  user: User;
}

export interface Category {
  id: number;
  excerpt: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  CategoryProduct: CategoryProduct[];
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
  slug: string;
  excerpt: string;
  price: number;
  weight: number;
  isCheap: boolean;
  createdAt: string;
  updatedAt: string;
  CategoryProduct: CategoryProduct[];
  ProductImages: ProductImage[];
  storeProducts: StoreProduct[];
  product: ProductDetails;
  priceAfterDiscount: number;
}

export interface Discount {
  id: number;
  type: DiscountType;
  name: string;
  value: number;
  minPurchase: number;
  maxDiscount: number;
  expiredAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  DiscountProduct: DiscountProduct[];
}

export interface DiscountProduct {
  productId: number;
  discountId: number;
  Product: Product;
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
  CategoryProduct: {
    Category: {
      name: string;
    };
  }[];
}

export interface Store {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  storeImage: string;
  province: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  maxServiceDistance: number;
  isPrimary: boolean;
  isActive: boolean;
  StoreUser: StoreUser[];
}

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
  minPurchase: number;
  maxPriceReduction: number;
  isActive: boolean;
  voucherImage: string;
  voucherCategory: VoucherCategory;
  stockVoucherAdmin: number;
  VoucherUser: VoucherUser[];
}

export interface VoucherUser {
  id: number;
  userId: number;
  productId: number;
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
  store: Store;
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

export type StoreProduct = {
  id: number;
  price: number;
  priceAfterDiscount: number;
  backupPrice: number;
  name: string;
  stock: number;
  isCheap: boolean;
  store: Store;
  product: Product;
};

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
  isVoucherApplied: boolean;
  priceAfterDiscount: number;
  priceAfterVoucher: number;
  total: number;
  totalAfterDiscount: number;
  valueVoucher: number;
  storeProduct: StoreProduct;
  Product: Product;
}

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
  priceAfterDiscount: number;
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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

export interface FormData {
  productId: string;
  name: string;
  excerpt: string;
  description: string;
  price: string;
  weight: string;
  categoryId: number;
  images: File[];
}
