# FinCal — Goal-Based Investment Calculator

**Team ThreadHeads · Technex 2026 · IIT BHU**
Built for the FinCal Innovation Hackathon, co-sponsored by HDFC Mutual Fund.

🔗 **Live Demo:** https://fincal-hack.vercel.app

---

## What it does

FinCal is a 4-step goal-based SIP calculator that helps investors plan monthly investments to reach a specific financial goal, accounting for inflation, expected returns, and tax.

**Step 1 — Choose Your Goal** — 8 presets (Home, Car, Education, Travel, Wedding, Medical, Business) + custom goal with emoji picker

**Step 2 — Investment Details** — Current cost of goal + years until you need the money, with live educational insights

**Step 3 — Assumptions** — Expected return, inflation rate, optional annual step-up SIP, optional LTCG tax

**Step 4 — Your Plan** — Monthly SIP needed, scenario comparison (Conservative / Balanced / Aggressive), corpus growth chart with milestone explorer, wealth breakdown, PDF download

---

## Financial Formulas

**Step 1 — Inflate goal value:**
```
FV = Present Cost × (1 + Inflation Rate)^Years
```

**Step 2 — Required Monthly SIP:**
```
SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]
where r = Annual Return ÷ 12,  n = Years × 12
```
Standard SIP-due (beginning of month) formula. For step-up SIP, binary search is used to find the base SIP that simulates to the required corpus.

---

## Tech Stack

| Technology | Version |
|---|---|
| Next.js | 15.5.9 |
| React | 18.3.1 |
| TypeScript | 5.x |
| jsPDF | 2.5.1 |
| Chart.js | 4.4.1 (CDN) |
| Node.js | 22.11.0 |

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/Swasti2004/fincal-goal-planner.git
cd fincal-goal-planner

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open **http://localhost:3000**

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, metadata, skip link
│   └── page.tsx            # Main orchestrator — all state lives here
├── components/
│   ├── Navbar.tsx          # Sticky HDFC blue header
│   ├── Footer.tsx          # Team branding + mandatory disclaimer
│   ├── ProgressHeader.tsx  # WCAG-compliant 4-step progress bar
│   ├── steps/
│   │   ├── Step1Goal.tsx   # Goal selection
│   │   ├── Step2Details.tsx
│   │   ├── Step3Assumptions.tsx
│   │   └── Step4Results.tsx  # Results, chart, PDF export
│   └── ui/
│       └── SliderInput.tsx # Reusable accessible slider
├── lib/
│   ├── finance.ts          # Pure financial formula functions
│   ├── formatters.ts       # INR formatting helpers
│   └── goals.ts            # Goal presets + mandatory disclaimer text
└── styles/
    └── globals.css         # All styles — HDFC brand compliant
```

---

## Compliance

- ✅ **WCAG 2.1 AA** — semantic HTML, ARIA roles, keyboard navigation, focus rings, screen reader labels
- ✅ **HDFC Brand Guidelines** — colors #224c87 / #da3832 / #919090, Montserrat/Arial/Verdana fonts
- ✅ **Mandatory Disclaimer** — verbatim on every page and in every PDF export
- ✅ **Responsive** — desktop, tablet (768px), mobile (480px)
- ✅ **No growth arrows or currency imagery**

---

## Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital market. Investor should not consider above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in future and is not a guarantee of any future returns.
