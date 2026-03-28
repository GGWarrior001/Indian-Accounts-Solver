# Contributing to Indian Accounts Solver

Thank you for your interest in contributing! This project aims to be a helpful, accurate, and accessible accounting tool for Indian students and professionals.

## 📋 Before You Start

- Check [existing issues](../../issues) to avoid duplicates
- For large changes, open an issue first to discuss
- Make sure your contribution follows Indian accounting standards (GAAP, Companies Act 2013, GST Act 2017)

## 🚀 How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/indian-accounts-solver.git
cd indian-accounts-solver
```

### 2. Create a Branch

Use a descriptive branch name:

```bash
git checkout -b feature/tds-calculator
git checkout -b fix/gst-rounding-error
git checkout -b docs/add-usage-examples
```

### 3. Make Changes

- All code lives in `index.html` (single-file architecture)
- Keep JavaScript vanilla — no frameworks required
- Follow the existing CSS variable naming convention
- Test in Chrome, Firefox, and Safari before submitting
- Ensure all amounts display in Indian number format (₹)

### 4. Commit with Clear Messages

Follow this format:

```
feat: add TDS deduction calculator
fix: correct WDV depreciation rounding in year 1
docs: add example transactions to README
style: improve mobile layout for balance sheet
```

### 5. Open a Pull Request

- Describe what you changed and why
- Mention any accounting standard or rule reference if applicable
- Include before/after screenshots for UI changes

## 🐛 Reporting Bugs

Please include:
- What you did (steps to reproduce)
- What you expected to happen
- What actually happened
- Browser and OS details

## 💡 Feature Ideas

Some areas where contributions are especially welcome:

| Area | Examples |
|---|---|
| New calculators | TDS, advance tax, partnership appropriation |
| Export | Print-friendly view, PDF export, Excel download |
| Data persistence | Save session data to localStorage |
| Accessibility | ARIA labels, keyboard navigation |
| Mobile UX | Better responsive layout on small screens |
| Validation | More detailed error messages and hints |

## 🧮 Accounting Accuracy

If you add or modify financial calculations, please cite the relevant rule or section:

- Companies Act 2013 (especially Schedule II & III)
- Income Tax Act 1961
- GST Act 2017
- Indian GAAP / AS (Accounting Standards) issued by ICAI

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
