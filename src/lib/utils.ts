/** 원화 포맷: 50000 → "5만원", 100000000 → "1억원" */
export function formatKRW(amount: number | null | undefined): string {
  if (amount == null) return "-";
  if (amount >= 100000000) {
    const uk = amount / 100000000;
    return `${uk % 1 === 0 ? uk : uk.toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    const man = amount / 10000;
    return `${man % 1 === 0 ? man : man.toFixed(1)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

/** 보험 종류 한글 변환 */
export function getInsuranceTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    life: "생명보험",
    non_life: "손해보험",
    health: "실손보험",
    third_party: "제3보험",
    policy: "정책/제도",
    market: "시장동향",
  };
  return labels[type] || type;
}

/** 보험 종류 색상 */
export function getInsuranceTypeColor(type: string): string {
  const colors: Record<string, string> = {
    life: "bg-blue-100 text-blue-700",
    non_life: "bg-orange-100 text-orange-700",
    health: "bg-green-100 text-green-700",
    third_party: "bg-purple-100 text-purple-700",
    policy: "bg-red-100 text-red-700",
    market: "bg-teal-100 text-teal-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

/** 날짜 포맷: ISO → "2024.03.25" */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** 상대 시간: "3시간 전", "2일 전" */
export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return formatDate(dateStr);
}
