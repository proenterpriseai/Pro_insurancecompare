export interface NewsItem {
  id: string;
  title: string;
  description: string | null;
  publisher: string | null;
  published_at: string | null;
  category: string | null;
  original_url: string;
  thumbnail_url: string | null;
}

export interface NewsListResponse {
  items: NewsItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface CategorySummary {
  category: string;
  count: number;
  latest_at: string | null;
}
