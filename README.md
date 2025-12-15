# ~/Portfolio_Terminal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security: Managed](https://img.shields.io/badge/Security-Policy-green)](SECURITY.md)
[![Status: Live](https://img.shields.io/badge/Status-Deployed-blue)](https://beeth73.github.io/10611/)

A highly optimized, terminal-themed engineering portfolio built on **Fundamentals**.

> **Live Deployment:** [beeth73.github.io/10611](https://beeth73.github.io/10611/)

---

## ⚡ Engineering Philosophy

In an era of 5MB JavaScript bundles and heavy frameworks, this project is a return to fundamentals. It is designed to be:

*   **Bloat-Free:** Zero frameworks. No React, No Tailwind, No jQuery. Just raw, semantic code.
*   **Universal:** Renders perfectly in 4K Chrome, mobile viewports, and text-based terminal browsers like `lynx` or `w3m` (via SSH/Termux).
*   **Accessible:** Semantic HTML structure ensures full compatibility with screen readers and keyboard navigation (`:focus-visible` support).
*   **Secure:** Implements strict Content Security Policy (CSP) headers and privacy-respecting analytics (GoatCounter).

## 🛠️ Tech Stack

*   **Core:** HTML5 (Semantic), CSS3 (Variables & Flexbox), Vanilla JavaScript (ES6+).
*   **Typography:** Fira Code (Monospaced).
*   **Analytics:** GoatCounter (GDPR Compliant, No-Cookie).
*   **Hosting:** GitHub Pages.

## 🚀 Features

*   **Terminal Aesthetic:** CLI-style interface with a command-line loader and "hacker" visual theme.
*   **Dark/Light Mode:** CSS Variable-based theming with local storage persistence.
*   **Project Showcase:** Dedicated sections for high-level engineering projects:
    *   **MendikotZero:** AlphaZero-style RL agent trained via Self-Play.
    *   **NIDS Engine:** ML-based Network Intrusion Detection System (XGBoost/RandomForest).
*   **Resume Integration:** Direct PDF access via header navigation.

## 📦 Installation & Local Dev

If you want to fork this or test it locally:

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/beeth73/10611.git
    cd 10611
    ```

2.  **Run locally (Python):**
    Since this is a static site, you don't need `npm`. Just serve the files.
    ```bash
    python3 -m http.server 8000
    ```

3.  **View:**
    Open `http://localhost:8000` in your browser.

## 🤝 Contributing & Forking

This project is open source and designed to be used as a template.
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on how to customize the ASCII art, links, and colors for your own portfolio.

## 🛡️ Security

This repository follows responsible disclosure.
Please read [SECURITY.md](SECURITY.md) for our vulnerability reporting policy and scope.

---

**© 2025 Bhushan Ladgaonkar**
