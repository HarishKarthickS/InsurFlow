# 🛡️ InsurFlow B2B: The Intelligence-First Claims Adjudication Engine

**Claim management doesn't have to be a nightmare.**  
Welcome to **InsurFlow B2B**, a high-performance, multi-tenant enterprise SaaS designed to transform how insurance companies ingest, analyze, and settle medical claims. Powered by **Next.js 15**, **Tailwind CSS v4**, and **Gemini AI**, this is the ultimate open-source toolkit for modern insurance infrastructure.

---

## ✨ The "Perfect SaaS" Experience

InsurFlow isn't just a tracker; it's a full-cycle automated ecosystem.

### 🧠 AI-Powered Efficiency
*   **Tiered OCR Pipeline:** Upload a medical bill and watch as our AI (Gemini 2.0) automatically extracts patient data, clinical descriptions, and financial amounts.
*   **Risk Engine:** Automated risk heuristics that flag policy violations and potential fraud the second a claim enters the system.

### 🏥 HospitalLink™ Provider Portal
*   **Self-Service Submission:** Hospitals and clinics can directly digitize claims through their own secure workspace.
*   **Settlement Transparency:** Providers can track every approved claim through to financial settlement with live bank reference tracking.

### 🏢 Enterprise Adjudication Center
*   **Master Queue:** A dense, data-rich command center for adjusters with real-time assignment and risk-level prioritization.
*   **Rule-Based Governance:** Admins can define custom adjudication policies (e.g., "Dental max ₹50k") that the system enforces automatically.
*   **Full Audit Traceability:** A permanent, immutable timeline for every claim, recording who did what, when, and why.

### 📊 Insight & Compliance
*   **Analytics Dashboards:** Beautiful, interactive charts showing volume trends and status distribution.
*   **Data Export Engine:** Generate and download comprehensive CSV reports for financial auditing with one click.

---

## 🛠️ Tech Stack (The Modern Monolith)

We've ditched the complexity of decoupled apps for a unified, high-velocity Next.js monolith.

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
*   **UI Engine:** [Tailwind CSS v4](https://tailwindcss.com/) (The future of styling)
*   **Intelligence:** [Gemini 1.5 Flash / 2.0 Exp](https://aistudio.google.com/)
*   **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose)
*   **Identity:** [Auth.js v5](https://authjs.dev/) (Enterprise RBAC)
*   **Infrastructure:** [Docker](https://www.docker.com/) & [Supabase Storage](https://supabase.com/)

---

## 🚀 Instant Deployment (Local Development)

Get your insurance workspace running in less than 2 minutes.

### 1. Configure your environment
Create a `.env` in the root (based on the provided template):
```env
MONGODB_URI=mongodb://mongodb_container:27017/claims-management
AUTH_SECRET=npx_auth_secret_result
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash-exp
STORAGE_TYPE=local
```

### 2. Launch with Docker
```bash
docker-compose up --build -d
```

### 3. Seed the Demo Environment
Populate your database with sample organizations, adjusters, and claims:
```bash
docker-compose exec app npm run seed
```

---

## 🔑 Demo Adjudicator Access
Go to [http://localhost:3000](http://localhost:3000) and use these pre-loaded accounts:

*   **Insurance Admin:** `admin@insurflow.com` (password: `password`)
*   **Adjuster Pool:** `adjuster@insurflow.com` (password: `password`)
*   **Hospital Admin:** `admin@citygeneral.com` (password: `password`)

---

## 🤝 Open Source & Fun
InsurFlow is built with ❤️ for the community. Whether you're an insurance professional looking to automate your workflow or a developer wanting to see a **Perfect Next.js Monolith** in action, you're welcome here.

**Happy Adjudicating!** 🚀🛡️
