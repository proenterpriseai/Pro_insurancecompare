import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "보험비교 - 보험 상품 비교 · 뉴스 · 약관 AI 분석",
  description:
    "모든 보험 상품을 비교하고, 최신 보험 뉴스를 확인하고, AI로 약관을 분석하세요. 생명보험, 손해보험, 실손보험, 제3보험 비교.",
  keywords: ["보험 비교", "보험 상품", "실손보험", "약관 분석", "보험 뉴스"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
