# Find to Fix — A Full-Cycle Vulnerability Assessment & Remediation Study

**Tester:** Ololade Okusanya
**Date:** 2026
**Target:** IBM SecurityCheckSample — Node.js Web Application
**Tools:** Snyk Code · Snyk Open Source · OWASP ZAP · Burp Suite · GitHub Actions

---

## Project Overview

This project demonstrates a complete application security assessment lifecycle — from static code analysis and dependency
scanning through to dynamic runtime testing and structured vulnerability reporting aligned with NIST 800-40.

The assessment follows four phases:

**Phase 1 — Identify**
Static (SAST), dependency (SCA), and dynamic (DAST) scanning using Snyk, OWASP ZAP, and Burp Suite.

**Phase 2 — Assess**
All findings classified by severity — Critical, High, Medium, Low — using CVE scoring and exploitability analysis.

**Phase 3 — Remediate**
Critical and High severity vulnerabilities patched by upgrading to Snyk-recommended dependency versions.

**Phase 4 — Verify**
Re-scan performed post-remediation to confirm all Critical and High findings resolved.

---

## Tools Used

- **Snyk Code** — SAST static source code analysis
- **Snyk Open Source** — SCA dependency vulnerability scanning
- **OWASP ZAP** — DAST automated runtime scanning
- **Burp Suite** — DAST manual HTTP traffic interception
- **GitHub Actions** — CI/CD automated security pipeline
- **Docker** — Containerized application deployment
---

## Framework Alignment

- **OWASP Top 10 (2025)** — All findings mapped to OWASP categories
- **NIST 800-40 Rev 4** — Full 4-phase assessment lifecycle followed
- **CVE Database** — All dependency vulnerabilities referenced by CVE ID

---

## 📁 Repository Structure

- `.github/workflows/` — Snyk CI/CD security pipeline
- `reports/` — Full vulnerability assessment report
- `screenshots/` — Evidence of scans and pipeline runs
- `README.md` — Project overview and findings summary
- `reports/` — Full vulnerability assessment report
- `screenshots/` — Evidence of scans and pipeline runs
- `README.md` — Project overview and findings summary 
