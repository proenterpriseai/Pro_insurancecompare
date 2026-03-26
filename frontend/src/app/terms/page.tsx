export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">이용약관</h1>

      <div className="space-y-6 text-sm text-secondary leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제1조 (목적)</h2>
          <p>
            본 약관은 보험비교 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차,
            이용자와 서비스 제공자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제2조 (서비스의 성격)</h2>
          <p>
            본 서비스는 보험 상품에 대한 <strong>정보 제공 목적</strong>으로만 운영됩니다.
            본 서비스는 보험 가입을 권유하거나 중개하지 않으며,
            보험업법상 보험대리점 또는 보험중개사에 해당하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제3조 (데이터 출처)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>보험 상품 데이터: 금융감독원 금융상품통합비교공시 API</li>
            <li>보험 뉴스: 네이버 검색 API를 통해 수집된 언론사 기사</li>
            <li>약관 분석: 사용자가 업로드한 PDF를 AI(Claude)가 분석한 결과</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제4조 (AI 분석 면책)</h2>
          <p>
            AI 약관 분석 결과는 <strong>참고 목적</strong>으로만 제공되며,
            법적 효력이 없습니다. AI 분석 결과의 정확성, 완전성, 적시성을 보장하지 않으며,
            분석 결과를 근거로 한 의사결정에 대해 서비스 제공자는 책임을 지지 않습니다.
            정확한 보장 내용은 반드시 해당 보험사에 직접 확인하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제5조 (업로드 파일 처리)</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>사용자가 업로드한 PDF 파일은 분석 완료 후 24시간 이내 자동 삭제됩니다.</li>
            <li>업로드된 파일은 약관 분석 목적으로만 사용되며, 제3자에게 제공되지 않습니다.</li>
            <li>파일에 포함된 개인정보는 자동으로 마스킹 처리됩니다.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">제6조 (면책사항)</h2>
          <p>
            서비스 제공자는 다음 사항에 대해 책임을 지지 않습니다:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>금융감독원 데이터의 정확성 및 최신성</li>
            <li>뉴스 기사의 내용 및 정확성</li>
            <li>AI 분석 결과의 오류 또는 누락</li>
            <li>서비스 이용으로 인한 직·간접적 손해</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
