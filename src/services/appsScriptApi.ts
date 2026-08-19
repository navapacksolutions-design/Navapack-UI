import { AdminProduct, QuoteFormData } from '../types';
import { APPS_SCRIPT_URL } from '../config/appsScript';

const endpoint = APPS_SCRIPT_URL;

type ApiResponse<T> = { ok: boolean; data?: T; message?: string };
type AppsScriptResponse<T> = {
  success: boolean;
  message?: string;
  products?: T;
};
function slugifyCategory(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function toBoolean(value: unknown): boolean {
  return value !== false && String(value).toLowerCase() !== 'false';
}

async function request<T>(action: string, payload: Record<string, unknown> = {}, token?: string): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, ...payload, token }),
  });
  const body = (await response.json()) as ApiResponse<T>;
  if (!body.ok) throw new Error(body.message || 'The request could not be completed.');
  return body.data as T;
}

async function getProducts(): Promise<AdminProduct[]> {
  const response = await fetch(`${endpoint}?action=getAllProducts`);
  const body = (await response.json()) as AppsScriptResponse<AdminProduct[]>;

  if (!response.ok || !body.success) {
    throw new Error(body.message || 'Unable to load products.');
  }

  const products = body.products || [];

  return products.map((product) => ({
    ...product,
    category: product.category?.trim() || 'Other Products',
    categorySlug: product.categorySlug?.trim() || slugifyCategory(product.category || 'other-products'),
    active: toBoolean(product.active),
  }));
}

export const appsScriptApi = {
  configured: Boolean(endpoint),
  login: (email: string, password: string) => request<{ token: string; user: { name: string; email: string } }>('login', { email, password }),
  getProducts,
  saveProduct: (product: AdminProduct, token: string) => request<AdminProduct>('saveProduct', { product }, token),
  submitQuote: (quote: QuoteFormData) => request<void>('submitQuote', { quote }),
  submitInquiry: (inquiry: Record<string, string>) => request<void>('submitInquiry', { inquiry }),
  subscribe: (email: string) => request<void>('subscribe', { email }),
};
