import Link from "next/link";

const features = [
  {
    href: "/compare",
    title: "상품비교",
    description: "생명·손해·실손·제3보험 상품을 한눈에 비교하세요",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    color: "bg-blue-50 text-primary",
  },
  {
    href: "/news",
    title: "보험뉴스",
    description: "보험 관련 최신 뉴스를 자동으로 수집해 드립니다",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    color: "bg-amber-50 text-accent",
  },
  {
    href: "/analyze",
    title: "약관분석",
    description: "AI가 보험 약관 PDF를 분석해 핵심 내용을 정리합니다",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "bg-green-50 text-success",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            보험, 비교하고 분석하세요
          </h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
            금융감독원 공식 데이터로 보험 상품을 비교하고,
            AI가 복잡한 약관을 쉽게 분석해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              상품 비교하기
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-lg border border-primary hover:bg-blue-50 transition-colors"
            >
              약관 분석하기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.href}
                href={feature.href}
                className="group p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h2>
                <p className="text-secondary">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Data Source */}
      <section className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-secondary">
            금융감독원 공식 공시 데이터 기반 | 네이버 뉴스 API 연동 | Claude AI 약관 분석
          </p>
        </div>
      </section>
    </div>
  );
}
