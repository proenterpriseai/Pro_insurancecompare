"use client";

import { Product } from "@/types/product";
import { formatKRW, getInsuranceTypeLabel } from "@/lib/utils";

interface ComparisonTableProps {
  products: Product[];
  onClose: () => void;
}

const rows = [
  { label: "보험사", key: "company_name" },
  { label: "보험 종류", key: "insurance_type", format: getInsuranceTypeLabel },
  { label: "월 보험료", key: "monthly_premium", format: formatKRW, highlight: "lowest" },
  { label: "보장금액", key: "coverage_amount", format: formatKRW, highlight: "highest" },
  { label: "보장기간", key: "coverage_period" },
  { label: "납입기간", key: "payment_period" },
  { label: "최저보증이율", key: "guarantee_rate", suffix: "%" },
] as const;

export default function ComparisonTable({ products, onClose }: ComparisonTableProps) {
  if (products.length === 0) return null;

  const getHighlight = (row: (typeof rows)[number], product: Product) => {
    if (!("highlight" in row) || !row.highlight) return "";
    const values = products
      .map((p) => (p as Record<string, unknown>)[row.key] as number | null)
      .filter((v): v is number => v != null);
    if (values.length === 0) return "";
    const val = (product as Record<string, unknown>)[row.key] as number | null;
    if (val == null) return "";
    if (row.highlight === "lowest" && val === Math.min(...values))
      return "bg-green-50 text-green-700 font-bold";
    if (row.highlight === "highest" && val === Math.max(...values))
      return "bg-green-50 text-green-700 font-bold";
    return "";
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-bold text-foreground">상품 비교</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-sm text-secondary font-medium py-2 pr-4 w-28"></th>
                {products.map((p) => (
                  <th
                    key={p.id}
                    className="text-left text-sm font-bold text-foreground py-2 px-3"
                  >
                    {p.product_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key} className="border-t border-border">
                  <td className="text-sm text-secondary font-medium py-3 pr-4">
                    {row.label}
                  </td>
                  {products.map((p) => {
                    const val = (p as Record<string, unknown>)[row.key];
                    let display: string;
                    if (val == null) {
                      display = "-";
                    } else if ("format" in row && row.format) {
                      display = (row.format as (v: unknown) => string)(val);
                    } else if ("suffix" in row && row.suffix) {
                      display = `${val}${row.suffix}`;
                    } else {
                      display = String(val);
                    }
                    return (
                      <td
                        key={p.id}
                        className={`text-sm py-3 px-3 ${getHighlight(row, p)}`}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Features row */}
              <tr className="border-t border-border">
                <td className="text-sm text-secondary font-medium py-3 pr-4 align-top">
                  주요 특징
                </td>
                {products.map((p) => (
                  <td key={p.id} className="text-sm py-3 px-3 align-top">
                    <ul className="space-y-1">
                      {p.key_features?.highlights?.map((f, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-primary">•</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
