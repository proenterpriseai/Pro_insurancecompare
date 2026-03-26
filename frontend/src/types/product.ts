export interface Product {
  id: string;
  company_name: string;
  product_name: string;
  insurance_type: string;
  insurance_subtype?: string;
  monthly_premium: number | null;
  coverage_amount: number | null;
  coverage_period: string | null;
  payment_period?: string | null;
  guarantee_rate?: number | null;
  key_features?: {
    highlights: string[];
  } | null;
  fss_updated_at?: string | null;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
}

export interface CompanyInfo {
  code: string;
  name: string;
  count: number;
}
