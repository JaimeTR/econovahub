export interface Creator {
  id: string;
  name: string;
  photo_url?: string;
  bio: string;
  profession: string;
  experience?: string;
  slug?: string;
  social_links: {
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  created_at: string;
}

export interface ProductFile {
  name: string;
  type: 'excel' | 'manual' | 'zip' | 'other';
  url: string;
  size: number;
  category?: 'main' | 'guide';
}

export interface Product {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  price: number;
  tagline: string;
  badge?: string;
  features: string[];
  image_url?: string;
  file_url?: string;
  files: ProductFile[];
  payment_url: string;
  paypal_url?: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  creator_name?: string;
  creator_photo?: string;
  created_at: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  config: any;
  product_ids: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  product_id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  culqi_reference?: string;
  buyer_email: string;
  product_name?: string;
  customer_name?: string;
  customer_email?: string;
  download_token?: string;
  created_at: string;
}

export interface Download {
  id: string;
  order_id: string;
  token: string;
  expires_at: string;
  max_downloads: number;
  download_count: number;
  product_name?: string;
  file_url?: string;
}

export interface DashboardStats {
  total_ventas: number;
  total_ingresos: number;
  total_clientes: number;
  total_productos: number;
  productos_activos: number;
}
