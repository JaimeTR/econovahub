import { getApiUrl } from './urls';

const API_URL = getApiUrl();

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, token } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache: method === 'GET' ? 'no-store' : undefined,
  };

  if (token) {
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de conexión' }));
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
}

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Creator / Auth
  getPublicProfile: () => apiRequest<import('./types').Creator>('/creators/public'),

  getCreatorBySlug: (slug: string) =>
    apiRequest<{ creator: import('./types').Creator; landing: any; products: import('./types').Product[] }>(`/creators/slug/${slug}`),

  login: (email: string, password: string) =>
    apiRequest<{ token: string; creator: { id: string; name: string; email: string; role: string } }>(
      '/creators/login',
      { method: 'POST', body: { email, password } }
    ),

  googleLogin: (credential: string) =>
    apiRequest<{ token: string; creator: { id: string; name: string; email: string; role: string } }>(
      '/creators/google-login',
      { method: 'POST', body: { credential } }
    ),

  googleRegister: (credential: string) =>
    apiRequest<{ token: string; creator: { id: string; name: string; email: string; role: string } }>(
      '/creators/google-register',
      { method: 'POST', body: { credential } }
    ),

  register: (name: string, email: string, password: string) =>
    apiRequest<{ token: string; creator: { id: string; name: string; email: string; role: string } }>(
      '/creators/register',
      { method: 'POST', body: { name, email, password } }
    ),

  sendVerificationCode: (name: string, email: string, password: string) =>
    apiRequest<{ message: string }>('/creators/send-verification-code', { method: 'POST', body: { name, email, password } }),

  verifyCode: (email: string, code: string) =>
    apiRequest<{ token: string; creator: { id: string; name: string; email: string; role: string } }>(
      '/creators/verify-code',
      { method: 'POST', body: { email, code } }
    ),

  getDashboardStats: (token: string) =>
    apiRequest<import('./types').DashboardStats>('/creators/dashboard', { token }),

  // Profile
  getMyProfile: (token: string) =>
    apiRequest<import('./types').Creator>('/creators/me', { token }),

  updateMyProfile: (token: string, data: FormData) =>
    fetch(`${API_URL}/creators/me`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Error al actualizar perfil');
      return json;
    }),

  // Products
  getProducts: () => apiRequest<import('./types').Product[]>('/products'),

  getMyProducts: (token: string) =>
    apiRequest<import('./types').Product[]>('/products/mine', { token }),

  getProduct: (id: string) =>
    apiRequest<import('./types').Product>(`/products/${id}`),

  createProduct: (token: string, data: FormData) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Error al crear producto');
      return json;
    }),

  updateProduct: (token: string, id: string, data: FormData) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    }).then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.error || 'Error al actualizar producto');
      return json;
    }),

  deleteProduct: (token: string, id: string) =>
    apiRequest<void>(`/products/${id}`, { method: 'DELETE', token }),

  // Orders
  getOrders: (token: string) =>
    apiRequest<import('./types').Order[]>('/orders', { token }),

  getOrder: (token: string, id: string) =>
    apiRequest<import('./types').Order>(`/orders/${id}`, { token }),

  createOrder: (data: { productId: string; name: string; email: string; phone?: string; amount: number }) =>
    apiRequest<import('./types').Order>('/orders', { method: 'POST', body: data }),

  // Downloads
  getDownloadInfo: (token: string) =>
    apiRequest<import('./types').Download>(`/downloads/${token}`),

  generateDownload: (authToken: string, orderId: string) =>
    apiRequest<import('./types').Download>(`/downloads/order/${orderId}`, { method: 'POST', token: authToken }),

  // Landing Pages
  getLandingPages: (token: string) =>
    apiRequest<import('./types').LandingPage[]>('/landing', { token }),

  getLandingPage: (token: string, id: string) =>
    apiRequest<import('./types').LandingPage>(`/landing/${id}`, { token }),

  getPublicLanding: (slug: string) =>
    apiRequest<import('./types').LandingPage & { config: any }>(`/landing/public/${slug}`),

  createLandingPage: (token: string, data: { slug: string; title: string; config?: any; product_ids?: string[] }) =>
    apiRequest<import('./types').LandingPage>('/landing', { method: 'POST', body: data, token }),

  updateLandingPage: (token: string, id: string, data: { title?: string; config?: any; product_ids?: string[]; published?: boolean }) =>
    apiRequest<void>(`/landing/${id}`, { method: 'PUT', body: data, token }),

  deleteLandingPage: (token: string, id: string) =>
    apiRequest<void>(`/landing/${id}`, { method: 'DELETE', token }),
};
