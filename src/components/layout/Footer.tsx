import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 서비스 소개 */}
          <div>
            <h3 className="font-bold text-foreground mb-2">보험비교</h3>
            <p className="text-sm text-secondary">
              모든 보험 상품을 비교하고, 최신 뉴스를 확인하고,
              AI로 약관을 분석하세요.
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="font-bold text-foreground mb-2">서비스</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/compare" className="text-secondary hover:text-primary">상품비교</Link></li>
              <li><Link href="/news" className="text-secondary hover:text-primary">보험뉴스</Link></li>
              <li><Link href="/analyze" className="text-secondary hover:text-primary">약관분석</Link></li>
            </ul>
          </div>

          {/* 법적 고지 */}
          <div>
            <h3 className="font-bold text-foreground mb-2">법적 고지</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/terms" className="text-secondary hover:text-primary">이용약관</Link></li>
              <li><Link href="/privacy" className="text-secondary hover:text-primary">개인정보처리방침</Link></li>
            </ul>
          </div>
        </div>

        {/* 면책조항 */}
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-secondary">
            본 서비스는 보험 상품에 대한 정보 제공 목적으로 운영되며, 보험 가입을 권유하거나 중개하지 않습니다.
            AI 약관 분석 결과는 참고용이며, 정확한 보장 내용은 반드시 해당 보험사에 직접 확인하시기 바랍니다.
            데이터 출처: 금융감독원, 네이버
          </p>
          <p className="text-xs text-secondary mt-2">
            &copy; {new Date().getFullYear()} 보험비교. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
