# HireFlow AI — Backend API

Enterprise AI-Powered Recruitment & HR Management System built with **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL/SQLite**.

---

## 🚀 Key Modules Implemented (According to Proposal)

| Module | Description | Endpoints |
| :--- | :--- | :--- |
| **1. Authentication & RBAC** | JWT Auth, Password hashing (`bcryptjs`), Role Guards (`ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `CANDIDATE`), password reset tokens. | `POST /api/auth/register`<br>`POST /api/auth/login`<br>`GET /api/auth/me`<br>`POST /api/auth/forgot-password` |
| **2. HR Dashboard & Analytics** | Real-time funnel metrics, active/closed jobs, hiring success rate, time-to-hire calculation, audit activity. | `GET /api/dashboard/metrics` |
| **3. Job Vacancy Management** | CRUD, search, filter (department, employment type, skills), pagination, public listing vs internal recruiter view. | `GET /api/jobs/public`<br>`GET /api/jobs/public/:slug`<br>`GET /api/jobs`<br>`POST /api/jobs`<br>`PATCH /api/jobs/:id/status` |
| **4. Candidate & Applications** | Candidate profile, resume uploads (PDF/DOCX), duplicate application prevention, application withdrawal. | `POST /api/applications/apply`<br>`GET /api/applications/my-applications`<br>`PATCH /api/applications/:id/withdraw` |
| **5. Pipeline Management** | Kanban stage transitions (`APPLIED` $\to$ `SCREENING` $\to$ `SHORTLISTED` $\to$ `INTERVIEW` $\to$ `OFFER` $\to$ `HIRED`), recruiter evaluation notes, audit logs. | `GET /api/applications/job/:jobId`<br>`PATCH /api/applications/:id/stage`<br>`POST /api/applications/:id/notes` |
| **6. AI Resume Screening** | Match score calculation (0–100%), matched/missing skills, evidence-based explainability, and human review override. | `POST /api/ai-screening/trigger/:id`<br>`PATCH /api/ai-screening/:id/override`<br>`POST /api/ai-screening/webhook` |
| **7. Interview Management** | Scheduling, interviewer assignment, meeting link, structured scorecards (1–5 ratings & recommendations). | `POST /api/interviews/schedule`<br>`GET /api/interviews`<br>`POST /api/interviews/:id/scorecard` |
| **8. Notifications** | In-app notification center, unread badges, mark-as-read, real-time alerts on stage movements & interview invites. | `GET /api/notifications`<br>`PATCH /api/notifications/:id/read`<br>`PATCH /api/notifications/read-all` |
| **9. Offer & Hiring** | Offer generator, approval workflow, candidate accept/decline, automated conversion of candidate into Employee record. | `POST /api/offers`<br>`PATCH /api/offers/:id/status`<br>`PATCH /api/offers/:id/respond` |
| **File Uploads** | Multi-part upload handler for PDF/DOCX resumes (up to 10MB) stored in `/uploads`. | `POST /api/uploads/resume` |

---

## 🛠️ Getting Started

### 1. Install & Build
```bash
npm install
npm run build
```

### 2. Database Sync & Seed
```bash
# Push schema to database
npm run prisma db push

# Seed realistic demo data (HR accounts, candidates, jobs, scorecards)
npm run seed
```

### 3. Start Development Server
```bash
npm run start:dev
```
* Server URL: `http://localhost:3000/api`
* Swagger Interactive API Documentation: **`http://localhost:3000/api/docs`**

---

## 👥 Seeded Demo Accounts (Password: `Password123!`)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@hireflow.ai` | `Password123!` |
| **Recruiter** | `recruiter@hireflow.ai` | `Password123!` |
| **Hiring Manager** | `manager@hireflow.ai` | `Password123!` |
| **Candidate 1 (Full-Stack)** | `alex.chen@hireflow.ai` | `Password123!` |
| **Candidate 2 (Designer)** | `sophia.taylor@hireflow.ai` | `Password123!` |

---

## 🗄️ Database Schemas
* `prisma/schema.prisma`: Zero-config SQLite configuration for immediate local testing & development.
* `prisma/schema.postgresql.prisma`: Production PostgreSQL schema with native enums for Docker deployment.
