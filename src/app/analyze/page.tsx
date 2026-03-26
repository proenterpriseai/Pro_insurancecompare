"use client";

import { useState, useRef, useCallback } from "react";

interface AnalysisResult {
  summary: string;
  product_name: string;
  company: string;
  coverage: { item: string; amount: string; conditions: string }[];
  exclusions: { item: string; detail: string }[];
  special_conditions: string[];
  waiting_period: string;
  key_warnings: string[];
}

// 더미 분석 결과 (API 연동 전)
const DUMMY_RESULT: AnalysisResult = {
  summary: "삼성생명 무배당 종신보험으로, 피보험자 사망 시 1억원을 보장하는 상품입니다. 20년 납입 기준 월 보험료 85,000원이며, 3대 질병 진단 시 납입이 면제됩니다.",
  product_name: "삼성생명 무배당 종신보험",
  company: "삼성생명",
  coverage: [
    { item: "일반사망", amount: "1억원", conditions: "보험기간 중 사망 시" },
    { item: "재해사망", amount: "1억원 추가", conditions: "재해로 인한 사망 시" },
    { item: "암 진단금", amount: "3,000만원", conditions: "최초 암 진단 확정 시 (90일 면책)" },
    { item: "뇌출혈 진단금", amount: "2,000만원", conditions: "뇌출혈 진단 확정 시" },
    { item: "급성심근경색 진단금", amount: "2,000만원", conditions: "급성심근경색 진단 확정 시" },
  ],
  exclusions: [
    { item: "자살", detail: "가입 후 2년 이내 자살 시 보장 제외" },
    { item: "음주운전", detail: "음주운전 중 사고로 인한 사망/장해 보장 제외" },
    { item: "기존 질병", detail: "계약 전 알릴의무 위반 시 보장 제한 가능" },
    { item: "전쟁/내란", detail: "전쟁, 혁명, 내란으로 인한 사망 보장 제외" },
  ],
  special_conditions: [
    "3대 질병(암, 뇌출혈, 급성심근경색) 진단 시 이후 보험료 납입 면제",
    "10년 이상 유지 시 연금으로 전환 가능",
    "저해약환급금형 선택 시 보험료 25% 절감",
  ],
  waiting_period: "암: 90일, 기타 질병: 없음",
  key_warnings: [
    "해약환급금이 납입보험료보다 적을 수 있습니다",
    "갱신형 특약은 갱신 시 보험료가 인상될 수 있습니다",
    "보험금 청구 시 진단서 등 증빙서류가 필요합니다",
  ],
};

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.toLowerCase().endsWith(".pdf")) {
      alert("PDF 파일만 업로드 가능합니다");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      alert("파일 크기가 20MB를 초과합니다");
      return;
    }
    setFile(f);
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const startAnalysis = async () => {
    if (!file) return;
    setAnalyzing(true);
    setResult(null);

    // 시뮬레이션 (API 연동 전)
    const steps = [
      { text: "PDF 텍스트 추출 중...", progress: 20 },
      { text: "약관 구조 분석 중... (Haiku)", progress: 40 },
      { text: "보장내용 분석 중... (Sonnet)", progress: 60 },
      { text: "면책사항 해석 중... (Sonnet)", progress: 80 },
      { text: "결과 정리 중...", progress: 95 },
    ];

    for (const step of steps) {
      setProgressText(step.text);
      setProgress(step.progress);
      await new Promise((r) => setTimeout(r, 800));
    }

    setProgress(100);
    setProgressText("분석 완료!");
    await new Promise((r) => setTimeout(r, 300));

    setResult(DUMMY_RESULT);
    setAnalyzing(false);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setProgress(0);
    setProgressText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">약관 AI 분석</h1>
      <p className="text-secondary mb-8">
        보험 약관 PDF를 업로드하면 AI가 핵심 내용을 분석해 드립니다.
      </p>

      {/* Upload Area */}
      {!result && !analyzing && (
        <>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              file ? "border-primary bg-blue-50" : "border-border hover:border-primary"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            {file ? (
              <>
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {file.name}
                </h3>
                <p className="text-sm text-secondary mb-4">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startAnalysis();
                  }}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  분석 시작
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-4">📄</div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  PDF 약관 파일을 올려주세요
                </h3>
                <p className="text-secondary text-sm mb-4">
                  드래그 앤 드롭하거나 클릭하여 파일을 선택하세요
                  <br />
                  PDF 파일만 가능 · 최대 20MB
                </p>
                <span className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium">
                  파일 선택
                </span>
              </>
            )}
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-4">
            <h4 className="font-bold text-foreground text-sm mb-2">AI 분석 안내</h4>
            <ul className="text-sm text-secondary space-y-1">
              <li>• 보장내용, 면책사항, 특약, 주의사항을 자동으로 분석합니다</li>
              <li>• 분석 결과에 신뢰도(높음/보통/낮음)가 함께 표시됩니다</li>
              <li>• AI 분석은 참고용이며, 정확한 내용은 보험사에 확인하세요</li>
              <li>• 업로드된 파일은 분석 후 24시간 이내 자동 삭제됩니다</li>
            </ul>
          </div>
        </>
      )}

      {/* Progress */}
      {analyzing && (
        <div className="bg-white border border-border rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4 animate-pulse">🤖</div>
            <h3 className="text-lg font-bold text-foreground mb-1">AI 분석 중</h3>
            <p className="text-sm text-secondary">{progressText}</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-secondary text-center mt-2">{progress}%</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">
              AI 분석 결과는 참고용이며, 정확한 보장 내용은 반드시 해당 보험사에 직접 확인하시기 바랍니다.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-lg font-bold text-foreground">전체 요약</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                신뢰도: 높음
              </span>
            </div>
            <p className="text-sm text-secondary leading-relaxed">{result.summary}</p>
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-secondary">상품: <strong className="text-foreground">{result.product_name}</strong></span>
              <span className="text-secondary">보험사: <strong className="text-foreground">{result.company}</strong></span>
            </div>
          </div>

          {/* Coverage */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-foreground">보장내용</h2>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                신뢰도: 높음
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-secondary font-medium">보장항목</th>
                    <th className="text-left py-2 pr-4 text-secondary font-medium">보장금액</th>
                    <th className="text-left py-2 text-secondary font-medium">조건</th>
                  </tr>
                </thead>
                <tbody>
                  {result.coverage.map((c, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2.5 pr-4 font-medium text-foreground">{c.item}</td>
                      <td className="py-2.5 pr-4 text-primary font-bold">{c.amount}</td>
                      <td className="py-2.5 text-secondary">{c.conditions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Exclusions */}
          <div className="bg-white border border-red-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-red-600">면책사항</h2>
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                신뢰도: 보통
              </span>
            </div>
            <ul className="space-y-3">
              {result.exclusions.map((e, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-500 mt-0.5 font-bold">!</span>
                  <div>
                    <span className="font-medium text-foreground">{e.item}: </span>
                    <span className="text-secondary">{e.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Special Conditions */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">특별약관/특약</h2>
            <ul className="space-y-2">
              {result.special_conditions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="text-secondary">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Waiting Period */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-foreground mb-2">대기기간</h2>
            <p className="text-sm text-secondary">{result.waiting_period}</p>
          </div>

          {/* Warnings */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-amber-800 mb-4">주의사항</h2>
            <ul className="space-y-2">
              {result.key_warnings.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-amber-600 mt-0.5 font-bold">⚠</span>
                  <span className="text-amber-800">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={reset}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              다른 약관 분석하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
