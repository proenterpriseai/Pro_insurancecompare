"use client";

import { useState, useEffect, useCallback } from "react";
import { NewsItem } from "@/types/news";
import NewsCard from "@/components/news/NewsCard";
import { DUMMY_NEWS } from "@/lib/dummy-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const categories = [
  { key: "", label: "전체" },
  { key: "life", label: "생명보험" },
  { key: "non_life", label: "손해보험" },
  { key: "health", label: "실손보험" },
  { key: "new_product", label: "신상품" },
  { key: "exclusion", label: "예외/면책" },
  { key: "underwriting", label: "심사/UW" },
  { key: "policy", label: "정책/제도" },
  { key: "market", label: "시장동향" },
];

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page_size: "20" });
      if (selectedCategory) params.set("category", selectedCategory);
      if (searchQuery) params.set("q", searchQuery);

      const res = await fetch(`${API_URL}/news?${params}`);
      if (!res.ok) throw new Error("뉴스를 불러올 수 없습니다");
      const data = await res.json();
      setArticles(data.items);
      setTotal(data.total);
    } catch {
      // API 실패 시 더미 데이터 사용
      let filtered = DUMMY_NEWS as NewsItem[];
      if (selectedCategory) filtered = filtered.filter((n) => n.category === selectedCategory);
      if (searchQuery) filtered = filtered.filter((n) => n.title.includes(searchQuery));
      setArticles(filtered);
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">보험 뉴스</h1>
      <p className="text-secondary mb-6">
        보험 관련 최신 뉴스를 자동으로 수집하여 제공합니다.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="뉴스 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? "bg-primary text-white"
                : "bg-muted text-secondary hover:text-primary"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-secondary mb-4">총 {total}건</p>

      {/* News List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-16 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-full mb-3" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 font-medium mb-2">오류 발생</p>
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchNews}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            다시 시도
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-8 text-center">
          <p className="text-secondary">해당 조건의 뉴스가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
