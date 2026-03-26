export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">개인정보처리방침</h1>

      <div className="space-y-6 text-sm text-secondary leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">1. 수집하는 개인정보</h2>
          <p>본 서비스는 회원가입 없이 이용 가능하며, 최소한의 정보만 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>자동 수집:</strong> 세션 ID (쿠키), 접속 로그, 브라우저 정보</li>
            <li><strong>약관 분석 시:</strong> 업로드된 PDF 파일 (분석 후 24시간 내 삭제)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">2. 개인정보의 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스 제공 및 분석 이력 관리</li>
            <li>서비스 개선 및 통계 분석</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">3. 개인정보의 보유 및 파기</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>세션 정보: 브라우저 종료 시 또는 30일 후 자동 삭제</li>
            <li>업로드된 PDF: 분석 완료 후 24시간 이내 자동 삭제</li>
            <li>분석 결과: 세션 기반 보관, 회원 탈퇴 또는 삭제 요청 시 즉시 파기</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">4. 제3자 제공</h2>
          <p>
            업로드된 약관 텍스트는 AI 분석을 위해 Anthropic(Claude API)에 전송됩니다.
            Anthropic의 API 이용약관에 따라 전송된 데이터는 모델 학습에 사용되지 않습니다.
            그 외 개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">5. 이용자의 권리</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>분석 이력 삭제 요청</li>
            <li>개인정보 열람 및 정정 요청</li>
            <li>쿠키 거부 (브라우저 설정을 통해 가능)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">6. 쿠키 사용</h2>
          <p>
            본 서비스는 분석 이력 관리를 위해 세션 쿠키를 사용합니다.
            브라우저 설정에서 쿠키를 거부할 수 있으나,
            일부 기능(분석 이력 조회)이 제한될 수 있습니다.
          </p>
        </section>
      </div>
    </div>
  );
}
