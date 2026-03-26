"use client";

import { Product } from "@/types/product";

interface ComparisonBarProps {
  selectedProducts: Product[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export default function ComparisonBar({
  selectedProducts,
  onRemove,
  onCompare,
  onClear,
}: ComparisonBarProps) {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto">
            <span className="text-sm font-medium text-secondary whitespace-nowrap">
              비교함 ({selectedProducts.length}/4)
            </span>
            {selectedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full whitespace-nowrap"
              >
                <span className="text-sm text-primary font-medium">
                  {p.company_name}
                </span>
                <button
                  onClick={() => onRemove(p.id)}
                  className="text-primary hover:text-primary-dark ml-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm text-secondary hover:text-foreground transition-colors"
            >
              초기화
            </button>
            <button
              onClick={onCompare}
              disabled={selectedProducts.length < 2}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedProducts.length >= 2
                  ? "bg-primary text-white hover:bg-primary-dark"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              비교하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
