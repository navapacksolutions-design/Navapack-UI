export type ScreenId = 'home' | 'products' | 'sustainability' | 'about' | 'contact' | 'login' | 'signup' | 'admin-products' | 'dashboard';

export type TransitionType = 'push' | 'push_back' | 'none';

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  tag: string;
  imageUrl: string;
}

export interface AdminProduct extends ProductItem {
  active?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  summary: string;
  readTime: string;
}

export interface QuoteFormData {
  fullName: string;
  company: string;
  email: string;
  phone?: string;
  productInterest?: string;
  estimatedVolume?: string;
  message: string;
}
