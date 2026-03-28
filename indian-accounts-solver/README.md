# 📒 Indian Accounts Solver — भारतीय लेखा

> A complete, browser-based Indian accounting toolkit following the **Double Entry System**, **Golden Rules of Accounting**, **Companies Act 2013**, and **GST Act 2017**.

![License](https://img.shields.io/badge/license-MIT-green)
![HTML](https://img.shields.io/badge/built%20with-HTML%2FCSS%2FJS-orange)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen)

---

## ✨ Features

| Module | Description |
|---|---|
| 📖 **Golden Rules** | Visual reference for Real, Personal & Nominal account rules |
| 📔 **Journal Entry** | Double-entry bookkeeping with Dr = Cr validation |
| 📒 **Ledger (T-Account)** | Auto-generated from journal entries |
| ⚖️ **Trial Balance** | Auto-checks if books are balanced |
| 📊 **P&L Account** | Trading & Profit & Loss with Gross/Net Profit |
| 🏛️ **Balance Sheet** | As per Schedule III, Companies Act 2013 |
| 📉 **Depreciation** | SLM & WDV methods with year-wise schedule |
| 🧾 **GST Calculator** | CGST + SGST / IGST as per GST Act 2017 |

---

## 🚀 Getting Started

### Option 1 — Open directly in browser (no setup needed)

```bash
git clone https://github.com/YOUR_USERNAME/indian-accounts-solver.git
cd indian-accounts-solver
# Open index.html in any browser
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

### Option 2 — GitHub Pages (live demo)

1. Fork this repository
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your tool will be live at `https://YOUR_USERNAME.github.io/indian-accounts-solver`

---

## 📸 Preview

```
┌─────────────────────────────────────────────────────┐
│  ₹  Indian Accounts Solver    भारतीय लेखांकन प्रणाली │
├─────────────────────────────────────────────────────┤
│ Rules │ Journal │ Ledger │ Trial │ P&L │ B/S │ GST  │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Golden Rules of Accounting                        │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│   │  Real    │ │ Personal │ │ Nominal  │           │
│   │ DR: In   │ │DR:Rcvr  │ │DR:Exp/  │           │
│   │ CR: Out  │ │CR: Giver│ │CR:Income│           │
│   └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

---

## 📚 Accounting Rules Covered

### Three Golden Rules (Traditional)

| Account Type | Debit | Credit |
|---|---|---|
| **Real Account** | What comes IN | What goes OUT |
| **Personal Account** | The RECEIVER | The GIVER |
| **Nominal Account** | All Expenses & Losses | All Incomes & Gains |

### Modern Approach

| Rule | Debit (Dr.) | Credit (Cr.) |
|---|---|---|
| Assets | Increase ↑ | Decrease ↓ |
| Liabilities | Decrease ↓ | Increase ↑ |
| Capital | Decrease ↓ | Increase ↑ |
| Expenses | Increase ↑ | Decrease ↓ |
| Income | Decrease ↓ | Increase ↑ |

---

## 🧮 Module Details

### Journal Entry
- Records transactions following the double-entry system
- Validates that Debit Amount = Credit Amount before saving
- Supports Voucher/Reference numbers and Narration
- All entries persist within the session for use in Ledger & Trial Balance

### Ledger (T-Account)
- Auto-posts from journal entries by matching account names
- Shows Dr. side, Cr. side, and Closing Balance
- Indicates whether balance is Debit or Credit

### Trial Balance
- Aggregates all ledger account balances
- Flags immediately if the trial balance does not tally
- Useful for detecting posting errors

### Profit & Loss Account
- **Trading Account**: Opening Stock + Purchases + Direct Expenses vs Sales + Closing Stock → Gross Profit
- **P&L Account**: Gross Profit + Other Income vs Indirect Expenses → Net Profit / Net Loss

### Balance Sheet (Schedule III Format)
- **Liabilities**: Share Capital, Reserves & Surplus, Long-term Borrowings, Creditors, Other Current Liabilities
- **Assets**: Fixed Assets, Investments, Inventories, Debtors, Cash & Bank, Other Current Assets
- Checks if Assets = Liabilities + Capital

### Depreciation Calculator
- **SLM (Straight Line Method)**: `(Cost − Salvage) / Useful Life`
- **WDV (Written Down Value)**: `Book Value × Rate%` each year
- Generates a full year-by-year depreciation schedule

### GST Calculator
- **Intra-State**: Splits into CGST + SGST (each at half rate)
- **Inter-State**: Single IGST at full rate
- Supports all GST slabs: 0%, 5%, 12%, 18%, 28%
- Calculates per-unit and total invoice value

---

## 🗂️ Project Structure

```
indian-accounts-solver/
├── index.html          # Main application (single-file, no build needed)
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## 🛠️ Tech Stack

- **Pure HTML5, CSS3, Vanilla JavaScript** — zero dependencies, zero build tools
- **Google Fonts** — Playfair Display, DM Mono, Noto Sans (loaded via CDN)
- Works entirely **offline** after first load (except fonts)

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas for improvements:

- [ ] Add export to PDF / Excel
- [ ] Add multi-year financial statements
- [ ] Add ratio analysis (Current Ratio, Quick Ratio, etc.)
- [ ] Add support for partnership accounts (P&L Appropriation)
- [ ] Add TDS calculation
- [ ] Add dark mode
- [ ] Add data persistence via localStorage
- [ ] Add print-friendly CSS

### How to contribute

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/add-ratio-analysis

# 3. Make your changes and commit
git commit -m "feat: add financial ratio analysis module"

# 4. Push and open a Pull Request
git push origin feature/add-ratio-analysis
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Made with ❤️ for Indian students, accountants, and small business owners.

---

## 🌟 Acknowledgements

- Rules based on **Indian GAAP** (Generally Accepted Accounting Principles)
- Balance Sheet format as per **Schedule III, Companies Act 2013**
- GST calculations as per **Central Goods & Services Tax Act, 2017**
- Depreciation as per **Companies Act 2013** and **Income Tax Act 1961**

---

> *"Every debit has a credit. Every action has a reaction."* — The Fundamental Law of Accounting
