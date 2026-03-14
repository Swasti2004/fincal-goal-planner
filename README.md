# FinCal — Goal-Based Investment Calculator
**Team ThreadHeads · Technex 2026 · IIT BHU · HDFC Mutual Fund Investor Education**

---

## Prerequisites

Make sure you have these installed on your machine:

| Tool | Required Version | Check command |
|------|-----------------|---------------|
| Node.js | **v18 or higher** | `node --version` |
| npm | v8 or higher | `npm --version` |

If Node.js is not installed, download it from https://nodejs.org (choose LTS version).

---

## Setup & Run (Step by Step)

### Step 1 — Unzip the project
```
Unzip fincal-threadheads-final.zip
```
You will get a folder called `fincal/`.

### Step 2 — Open terminal in the project folder
```bash
cd fincal
```

### Step 3 — Install dependencies
```bash
npm install
```
This installs Next.js, React, and jsPDF. Takes about 1–2 minutes.

### Step 4 — Start the development server
```bash
npm run dev
```

### Step 5 — Open in browser
```
http://localhost:3000
```

That's it! The app is running.

---

## Project Structure

```
fincal/
├── src/
│   ├── app/
│   │   ├── layout.tsx          Root layout (metadata, skip link)
│   │   └── page.tsx            Main orchestrator — all state lives here
│   ├── components/
│   │   ├── Navbar.tsx          Sticky blue header
│   │   ├── Footer.tsx          Team ThreadHeads footer + disclaimer
│   │   ├── ProgressHeader.tsx  4-step progress bar
│   │   ├── steps/
│   │   │   ├── Step1Goal.tsx   Goal selection (8 presets + custom)
│   │   │   ├── Step2Details.tsx  Cost + years sliders
│   │   │   ├── Step3Assumptions.tsx  Return/inflation/step-up/tax
│   │   │   └── Step4Results.tsx  Full results page (chart, PDF, scenarios)
│   │   └── ui/
│   │       └── SliderInput.tsx Reusable WCAG-compliant slider
│   ├── lib/
│   │   ├── finance.ts          All financial formulas (pure functions)
│   │   ├── formatters.ts       ₹ formatting helpers
│   │   └── goals.ts            Goal presets, emojis, disclaimer text
│   └── styles/
│       └── globals.css         All styles (single file, no CSS modules)
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## Financial Formulas Used

**Step 1 — Inflate goal value:**
```
FV = Present Cost × (1 + Inflation Rate)^Years
```

**Step 2 — Required Monthly SIP:**
```
SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
where r = Annual Return ÷ 12,  n = Years × 12
```
This is the standard SIP-due (beginning of month) formula.

For step-up SIP, binary search is used to find the base SIP that produces the required corpus via year-wise simulation.

---

## Build for Production

```bash
npm run build
npm start
```

---

## Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
