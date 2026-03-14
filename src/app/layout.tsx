// src/app/layout.tsx
import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "FinCal · Goal-Based Investment Calculator",
  description:
    "Plan your financial goals with SIP — HDFC Mutual Fund Investor Education Tool. Built by Team ThreadHeads for Technex 2026, IIT BHU.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning on <body> is the official Next.js recommendation
        for browser-extension attribute injection (e.g. password managers, translate tools).
        It does NOT suppress real app hydration errors — only external attribute additions.
        This is WCAG-safe and does not affect screen readers or ARIA.
        See: https://nextjs.org/docs/messages/react-hydration-error
      */}
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
