"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import ProductCard from "@/components/compare/ProductCard";
import ComparisonBar from "@/components/compare/ComparisonBar";
import ComparisonTable from "@/components/compare/ComparisonTable";
import { DUMMY_PRODUCTS } from "@/lib/dummy-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const typeFilters = [
  { key: "", label: "전체" },
  { key: "life", label: "생명" },
  { key: "non_life", label: "손해" },
  { key: "health", label: "실손" },
  { key: "third_party", label: "제3보험" },
];

const sortOptions = [
  { value: "monthly_premium:asc", label: "보험료 낮은순" },
  { value: "monthly_premium:desc", label: "보험료 높은순" },
  { value: "coverage_amount:desc", label: "보장금액 높은순" },
];

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("monthly_premium:asc");

  // Comparison
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sortField, sortOrder] = sortBy.split(":");
      const params = new URLSearchParams({
        sort_by: sortField,
        sort_order: sortOrder,
        page_size: "50",
      });
      if (selectedType) params.set("insurance_type", selectedType);

      const res = await fetch(`${API_URL}/products?${params}`);
      if (!res.ok) throw new Error("상품 데이터를 불러올 수 없습니다");
      const data = await res.json();
      setProducts(data.items);
      setTotal(data.total);
    } catch {
      // API 실패 시 더미 데이터 사용
      let filtered = DUMMY_PRODUCTS;
      if (selectedType) filtered = filtered.filter((p) => p.insurance_type === selectedType);
      const [sortField, sortOrder] = sortBy.split(":");
      filtered = [...filtered].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortField] as number ?? 0;
        const bv = (b as Record<string, unknown>)[sortField] as number ?? 0;
        return sortOrder === "asc" ? av - bv : bv - av;
      });
      setProducts(filtered);
      setTotal(filtered.length);
    } finally {
      setLoading(false);
    }
  }, [selectedType, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 4) {
        next.add(id);
      }
      return next;
    });
  };

  const selectedProducts = products.filter((p) => selectedIds.has(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">보험 상품 비교</h1>
      <p className="text-secondary mb-8">
        금융감독원 공시 데이터를 기반으로 보험 상품을 비교하세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-border rounded-xl p-4 sticky top-20">
            <h2 className="font-bold text-foreground mb-4">필터</h2>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground block mb-2">
                보험 종류
              </label>
              <div className="flex flex-wrap gap-2">
                {typeFilters.map((tf) => (
                  <button
                    key={tf.key}
                    onClick={() => setSelectedType(tf.key)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      selectedType === tf.key
                        ? "border-primary bg-primary text-white"
                        : "border-border hover:border-primary hover:text-primary"
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium text-foreground block mb-2">
                정렬
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs text-secondary">
              총 {total}개 상품
            </div>
          </div>
        </aside>

        {/* Product List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-border rounded-xl p-5 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <p className="text-red-600 font-medium mb-2">오류 발생</p>
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
              >
                다시 시도
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-border rounded-xl p-8 text-center">
              <p className="text-secondary">해당 조건의 상품이 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.has(product.id)}
                  onToggleSelect={toggleSelect}
                  selectionCount={selectedIds.size}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedProducts={selectedProducts}
        onRemove={(id) => toggleSelect(id)}
        onCompare={() => setShowComparison(true)}
        onClear={() => setSelectedIds(new Set())}
      />

      {/* Comparison Modal */}
      {showComparison && (
        <ComparisonTable
          products={selectedProducts}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Bottom padding for comparison bar */}
      {selectedIds.size > 0 && <div className="h-20" />}
    </div>
  );
}
