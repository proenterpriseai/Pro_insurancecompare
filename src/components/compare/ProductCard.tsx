"use client";

import { Product } from "@/types/product";
import { formatKRW, getInsuranceTypeLabel, getInsuranceTypeColor } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  selectionCount: number;
}

export default function ProductCard({
  product,
  isSelected,
  onToggleSelect,
  selectionCount,
}: ProductCardProps) {
  const canSelect = selectionCount < 4 || isSelected;

  return (
    <div
      className={`border rounded-xl p-5 transition-all ${
        isSelected
          ? "border-primary bg-blue-50 shadow-md"
          : "border-border bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getInsuranceTypeColor(
              product.insurance_type
            )}`}
          >
            {getInsuranceTypeLabel(product.insurance_type)}
          </span>
          <p className="text-sm text-secondary mt-1">{product.company_name}</p>
        </div>
      </div>

      {/* Product Name */}
      <h3 className="font-bold text-foreground mb-4 leading-tight">
        {product.product_name}
      </h3>

      {/* Key Info */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-secondary">월 보험료</span>
          <span className="font-bold text-foreground">
            {formatKRW(product.monthly_premium)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">보장금액</span>
          <span className="font-medium text-foreground">
            {formatKRW(product.coverage_amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-secondary">보장기간</span>
          <span className="text-foreground">{product.coverage_period || "-"}</span>
        </div>
        {product.guarantee_rate != null && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary">최저보증이율</span>
            <span className="text-foreground">{product.guarantee_rate}%</span>
          </div>
        )}
      </div>

      {/* Features */}
      {product.key_features?.highlights && (
        <div className="mb-4">
          <ul className="space-y-1">
            {product.key_features.highlights.slice(0, 3).map((f, i) => (
              <li key={i} className="text-xs text-secondary flex items-start gap-1">
                <span className="text-primary mt-0.5">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Button */}
      <button
        onClick={() => onToggleSelect(product.id)}
        disabled={!canSelect}
        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          isSelected
            ? "bg-primary text-white hover:bg-primary-dark"
            : canSelect
            ? "bg-muted text-secondary hover:bg-gray-200"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isSelected ? "선택 해제" : "비교함에 담기"}
      </button>
    </div>
  );
}
