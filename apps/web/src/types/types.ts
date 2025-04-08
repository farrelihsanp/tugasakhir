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
  slug: string; // ✅ Tambahkan ini
  latitude: number;
  longitude: number;
  maxServiceDistance: number;
  isPrimary: boolean;
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export interface Product {
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
}
