# HireFlow AI: AI-Powered Recruitment & HR Management System

<p align="center">
  <img src="https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/Architecture-Microservices-blue?style=for-the-badge" alt="Architecture" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Frontend-Next.js%2015.1-black?logo=nextdotjs&logoColor=white" alt="Next.js 15" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/UI%20Library-React%2019-20232a?logo=react&logoColor=61DAFB" alt="React 19" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/Backend-NestJS%2012-E0234E?logo=nestjs&logoColor=white" alt="NestJS 12" /></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/AI%20Microservice-FastAPI-009688?logo=fastapi&logoColor=white" alt="FastAPI" /></a>
  <a href="https://prisma.io/"><img src="https://img.shields.io/badge/ORM-Prisma%206-2D3748?logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/Database-PostgreSQL%2016-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://redis.io/"><img src="https://img.shields.io/badge/Cache-Redis%207-DC382D?logo=redis&logoColor=white" alt="Redis" /></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Container-Docker%20Compose-2496ED?logo=docker&logoColor=white" alt="Docker" /></a>
</p>

---

## 📑 Table of Contents
1. [Executive Summary & Problem Statement](#-executive-summary--problem-statement)
2. [System Architecture](#-system-architecture)
3. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Phase 1: AI-Powered Applicant Tracking System (ATS)](#phase-1-ai-powered-applicant-tracking-system-ats)
   - [Phase 2: Core HR Operations & Employee Management (HRIS)](#phase-2-core-hr-operations--employee-management-hris)
4. [Explainable & Ethical AI Screening](#-explainable--ethical-ai-screening)
5. [Database Architecture & Entity Design](#-database-architecture--entity-design)
6. [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
7. [REST API Documentation & Endpoint Directory](#-rest-api-documentation--endpoint-directory)
8. [Frontend Interface & Route Directory](#-frontend-interface--route-directory)
9. [Configuration & Environment Variables](#-configuration--environment-variables)
10. [Step-by-Step Installation & Quickstart](#-step-by-step-installation--quickstart)
    - [Method A: Zero-Config Local Development (SQLite)](#method-a-zero-config-local-development-fastest-zero-dependencies)
    - [Method B: Full-Stack Docker Compose (PostgreSQL & Redis)](#method-b-full-stack-docker-compose-production-parity)
11. [Interactive Sandbox & Demo Credentials](#-interactive-sandbox--demo-credentials)
12. [Testing & Quality Assurance](#-testing--quality-assurance)
13. [Security, Hardening & Compliance](#-security-hardening--compliance)
14. [Troubleshooting & FAQs](#-troubleshooting--faqs)
15. [License & Acknowledgments](#-license--acknowledgments)

---

## 🎯 Executive Summary & Problem Statement

Modern talent acquisition and human resource teams face four critical operational bottlenecks:
1. **Resume Overload**: Recruiters spend an average of 6–10 hours per job requisition manually reading resumes, resulting in fatigue and subjective biases.
2. **Disconnected Tools**: Organizations use separate tools for job posting, applicant tracking, interview scorecards, offer letters, onboarding, and attendance, resulting in fragmented data.
3. **Black-Box AI Skepticism**: Many automated hiring tools offer opaque "pass/fail" decisions that trigger compliance, fairness, and EEOC concerns.
4. **Poor Candidate Experience**: Applicants receive little to no feedback, unclear interview logistics, and delayed status updates.

### The HireFlow AI Solution

| Legacy Recruitment & HR | HireFlow AI Enterprise Solution |
| :--- | :--- |
| Manual scanning of hundreds of PDF/Word resumes | **Sub-second CV parsing** with NLP extraction of skills and experience |
| Black-box automated rejections causing bias risks | **Explainable AI Scoring (0–100)** with mandatory **Human-in-the-Loop Override** |
| Spreadsheets for interview evaluation | **Structured multi-round scorecards** (1–5 scale) tied directly to requisitions |
| Disconnected ATS and HR platforms | **1-Click Conversion** from accepted job offers directly into active Employee records |
| Scattered employee documents and manual checklists | **Unified HRIS** for automated onboarding, leave balances, and daily attendance |

---

## 🏗️ System Architecture

HireFlow AI is designed as a modular, service-oriented ecosystem with clean boundary separation between the presentation tier, business domain logic, and computationally heavy NLP processing.

### High-Level Topology

```mermaid
graph TD
    subgraph Client Layer
        Web["Next.js 15.1 App Router<br/>React 19 | Tailwind CSS<br/>Port 3001"]
    end

    subgraph API Gateway & Core Domain
        Backend["NestJS 12 Main Backend<br/>TypeScript | Passport JWT | Swagger<br/>Port 3000"]
    end

    subgraph AI Intelligence Engine
        AIService["FastAPI AI Microservice<br/>Python 3.11 | pypdf | docx | NLP<br/>Port 8000"]
    end

    subgraph Persistence & Infrastructure
        DB[("PostgreSQL 16 / SQLite<br/>Prisma ORM 6")]
        Cache[("Redis 7 Cache<br/>Queues & Session State")]
        Storage[("Local / Cloud Storage<br/>Encrypted PDF & DOCX Resumes")]
    end

    Web -->|HTTP / REST + Bearer JWT| Backend
    Backend -->|Prisma Client Queries| DB
    Backend -->|Caching & Rate Limiting| Cache
    Backend -->|CV Storage & Retrieval| Storage
    Backend -->|Async Screening Dispatch| AIService
    AIService -->|Extracted Text, Skills & Match Scores| Backend
```

### Resume Screening & Human-in-the-Loop Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Candidate as Candidate
    participant NextUI as Next.js Web App
    participant NestAPI as NestJS Backend
    participant FileStorage as File Storage
    participant PyAI as FastAPI AI Service
    actor Recruiter as Recruiter / Hiring Mgr

    Candidate->>NextUI: Upload CV (PDF/DOCX) & Apply
    NextUI->>NestAPI: POST /api/applications (Multipart Form)
    NestAPI->>FileStorage: Save Encrypted CV to Storage
    NestAPI-->>NextUI: Application Created (Status: APPLIED)
    
    Recruiter->>NextUI: Click "Trigger AI Screen" on Kanban
    NextUI->>NestAPI: POST /api/ai-screening/screen/:applicationId
    NestAPI->>PyAI: POST /screen (Resume File + Job Description)
    Note over PyAI: Extract Text (pypdf/docx)<br/>Extract Candidate Skills<br/>Match Requirements<br/>Compute Explainable Score
    PyAI-->>NestAPI: Return Score (0-100), Matched/Missing Skills, Evidence
    NestAPI->>NestAPI: Store Screening Record (PENDING_REVIEW)
    NestAPI-->>NextUI: Live WebSocket / SSE Update
    
    Recruiter->>NextUI: Inspect Evidence Modal (Matched vs Missing)
    alt Recruiter Agrees
        Recruiter->>NextUI: Click "Approve AI Recommendation"
        NextUI->>NestAPI: PATCH /api/ai-screening/override/:id (APPROVED)
    else Recruiter Overrides
        Recruiter->>NextUI: Enter Override Justification & Manual Status
        NextUI->>NestAPI: PATCH /api/ai-screening/override/:id (OVERRIDDEN + Notes)
    end
    NestAPI-->>NextUI: Application Advanced to INTERVIEW_SCHEDULED
```

---

## 🚀 Core Feature Breakdown

### Phase 1: AI-Powered Applicant Tracking System (ATS)

#### 1. Authentication & Role-Based Access Control (RBAC)
- Multi-role architecture: `ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `CANDIDATE`.
- Stateless JWT authentication with cryptographic payload verification.
- Passwords salted and hashed with `bcryptjs` (10 rounds).
- Modular guards (`JwtAuthGuard`, `RolesGuard`) guarding all internal endpoints.

#### 2. Executive Analytics & KPI Dashboard
- Real-time conversion funnel monitoring across all 8 pipeline stages.
- Automated calculation of **Time-to-Hire** (in calendar days).
- **Offer Acceptance Rate** calculation: `(Accepted / Extended) * 100`.
- System-wide immutable audit trail of recent administrative actions.

#### 3. Job Requisition & Lifecycle Management
- Job posting statuses: `DRAFT`, `PUBLISHED`, `CLOSED`.
- Requisition parameters: department, employment type (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`), work arrangement (`REMOTE`, `HYBRID`, `ON_SITE`), salary ranges (`minSalary`, `maxSalary`), and closing dates.
- Public candidate-facing job board filters with instant keyword matching.

#### 4. Candidate Talent Database & De-duplication
- Centralized talent repository across historical job openings.
- Automated de-duplication based on verified email addresses to prevent duplicate candidate records.
- Complete chronological audit log of candidate applications, notes, and status transitions.

#### 5. Interactive 8-Stage Kanban Application Workflow
- Visual board representing 8 statuses:
  `APPLIED` ➔ `SCREENING` ➔ `INTERVIEW_SCHEDULED` ➔ `INTERVIEW_COMPLETED` ➔ `OFFER_EXTENDED` ➔ `OFFER_ACCEPTED` / `REJECTED` / `WITHDRAWN`.
- Fluid drag-and-drop status transitions with optimistic UI updates.
- Modal inspection with full candidate details, CV preview, and AI diagnostic reports.

#### 6. AI Resume Screening Engine
- Sub-second parsing of `.pdf` and `.docx` resumes using `pypdf` and `python-docx`.
- Heuristic skill matching combined with semantic cosine similarity scoring.
- Comprehensive breakdown: overall score (0–100), matched required skills, matched preferred skills, and missing skill gaps.
- Direct evidence citations extracted from resume paragraphs.

#### 7. Interview Scheduling & Structured Scorecards
- Multi-round scheduling: Screening, Technical, Culture Fit, Final Round.
- Automatic Google Meet / virtual conferencing link generation.
- Structured evaluation scorecards featuring 1–5 numerical ratings across key dimensions:
  - Technical Competency
  - Communication Skills
  - Problem Solving
  - Cultural Alignment
- Standardized recommendations: `STRONG_HIRE`, `HIRE`, `NO_HIRE`, `STRONG_NO_HIRE`.

#### 8. Offer Management & Conversion to Employee
- Structured offer generation: role, department, proposed salary, start date, expiration date, and benefits summary.
- Managerial sign-off workflow (`PENDING_APPROVAL`, `APPROVED`, `REJECTED`).
- Candidate self-service portal for reviewing, accepting, or declining offers.
- **1-Click Employee Conversion**: Automatically provisions an active `Employee` record upon candidate offer acceptance.

#### 9. Unified Notification Center
- Event-triggered alerts for candidate application submissions, interview schedule changes, scorecard completions, and offer approvals.
- Real-time in-app notification bell with unread indicators and read-state management.

---

### Phase 2: Core HR Operations & Employee Management (HRIS)

#### 10. Centralized Employee Records Management
- Employee profile tracking: Employee ID, department, title, manager relationship, date of joining, contact details.
- Employment status management: `ACTIVE`, `ON_LEAVE`, `TERMINATED`.
- Work model designations: `REMOTE`, `HYBRID`, `ON_SITE`.

#### 11. Role-Based Employee Onboarding
- Structured onboarding task templates (IT hardware provisioning, account access, compliance reading, manager 1-on-1s).
- Assignable tasks with due dates, priorities, and dependency checklists.
- Real-time onboarding progress bar calculated dynamically: `(Completed / Total) * 100`.

#### 12. Leave Management & Balance Accounting
- Support for multiple leave types: `ANNUAL`, `SICK`, `UNPAID`, `MATERNITY`, `PATERNITY`.
- Leave balance tracking with automated day deductions upon approval.
- Managerial approval and rejection interface with optional reviewer remarks.

#### 13. Daily Attendance & Time Tracking
- Self-service clock-in and clock-out logging with IP/timestamp tracking.
- Automated work hours calculation and overtime tracking.
- Daily status classifications: `PRESENT`, `LATE`, `HALF_DAY`, `REMOTE`.

#### 14. HR Analytics & Intelligence Reports
- Departmental headcount allocation charts.
- Monthly hiring velocity and recruitment throughput.
- Attrition and employee turnover percentage analytics.
- Leave type utilization and absenteeism reporting.

#### 15. Compliance, Governance & System Settings
- Enterprise department hierarchy configuration.
- Comprehensive system audit logs logging timestamps, user agents, modified entities, and action types (`CREATE`, `UPDATE`, `DELETE`, `OVERRIDE`).

---

## 🧠 Explainable & Ethical AI Screening

HireFlow AI is designed from the ground up to eliminate the ethical and regulatory pitfalls of automated hiring software.

```
┌─────────────────────────────────────────────────────────────┐
│                    Explainable Scoring Model                │
│                                                             │
│   Score = (0.55 × Required Skills Match)                    │
│         + (0.25 × Years of Relevant Experience)             │
│         + (0.20 × Domain Semantic Similarity)               │
└─────────────────────────────────────────────────────────────┘
```

### Core Ethical Pillars
1. **Advisory Co-Pilot, Not an Auto-Executioner**: The AI microservice never rejects an applicant autonomously. Candidates scoring below a threshold are flagged for human recruiter evaluation.
2. **Transparent Skill Gap Breakdown**: Every evaluation clearly displays:
   - **Matched Skills**: e.g., `["NestJS", "TypeScript", "PostgreSQL", "Docker"]`
   - **Missing Skills**: e.g., `["Kubernetes", "GraphQL"]`
   - **Extracted Evidence**: Direct citations from the candidate's resume verifying claims.
3. **Mandatory Human Recruiter Override**: A human recruiter or hiring manager has full authority to override any AI recommendation (`APPROVED` vs `OVERRIDDEN`) by providing an auditable justification note stored in the permanent database log.
4. **Anti-Bias Filtering**: PII such as gender, age, photographs, and marital status are strictly excluded from the match scoring algorithm.

---

## 🗄️ Database Architecture & Entity Design

HireFlow AI uses a unified relational database architecture via **Prisma ORM 6**, supporting both zero-config local development (`SQLite`) and production environments (`PostgreSQL 16`).

```mermaid
erDiagram
    User ||--o{ Application : submits
    User ||--o{ Interview : conducts
    User ||--o{ Scorecard : writes
    User ||--o{ Offer : approves
    User ||--o{ LeaveRequest : requests
    User ||--o{ Attendance : logs
    
    Job ||--o{ Application : receives
    Job }|--|| Department : belongs_to
    
    Candidate ||--o{ Application : has
    Candidate ||--o| Employee : converts_to
    
    Application ||--o| AIScreening : evaluates
    Application ||--o{ Interview : schedules
    Application ||--o| Offer : generates
    
    Interview ||--o{ Scorecard : contains
    
    Employee ||--o{ OnboardingTask : assigned
    Employee ||--o{ LeaveRequest : submits
    Employee ||--o{ Attendance : records
```

### Key Schema Entities

| Entity Model | Purpose | Primary Relations |
| :--- | :--- | :--- |
| `User` | Authentication identity & RBAC role holder | One-to-Many: `Interview`, `Scorecard`, `AuditLog`, `LeaveRequest` |
| `Job` | Job requisition and role specification | One-to-Many: `Application`, Many-to-One: `Department` |
| `Candidate` | Candidate talent record | One-to-Many: `Application`, One-to-One: `Employee` |
| `Application` | Candidate's application for a specific requisition | One-to-One: `AIScreening`, `Offer`; One-to-Many: `Interview` |
| `AIScreening` | Explainable scoring record with skill breakdown | One-to-One: `Application` |
| `Interview` | Interview session with date, type, and meeting link | Many-to-One: `Application`; One-to-Many: `Scorecard` |
| `Scorecard` | Evaluation rating (1–5) and recommendation | Many-to-One: `Interview`, `User` (Interviewer) |
| `Offer` | Compensation offer letter and approval lifecycle | One-to-One: `Application` |
| `Employee` | Active corporate employee record | One-to-One: `Candidate`; One-to-Many: `OnboardingTask`, `LeaveRequest` |
| `OnboardingTask` | Checklist item for new hire onboarding | Many-to-One: `Employee` |
| `LeaveRequest` | Employee time-off request with approval status | Many-to-One: `Employee` |
| `Attendance` | Daily employee clock-in, clock-out, and hours worked | Many-to-One: `Employee` |
| `AuditLog` | Immutable security and regulatory activity record | Many-to-One: `User` |

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Module & Action | Admin | Recruiter | Hiring Manager | Candidate |
| :--- | :---: | :---: | :---: | :---: |
| **View Dashboard & Funnel KPIs** | ✅ | ✅ | ✅ *(Dept Only)* | ❌ |
| **Create & Publish Job Postings** | ✅ | ✅ | ❌ | ❌ |
| **Apply to Jobs & Upload Resumes** | ❌ | ❌ | ❌ | ✅ |
| **Drag & Drop Kanban Pipeline** | ✅ | ✅ | ✅ | ❌ |
| **Trigger AI Resume Screening** | ✅ | ✅ | ✅ | ❌ |
| **Override AI Recommendations** | ✅ | ✅ | ❌ | ❌ |
| **Schedule Interviews & Links** | ✅ | ✅ | ❌ | ❌ |
| **Submit Interview Scorecards** | ✅ | ✅ | ✅ | ❌ |
| **Generate & Approve Job Offers** | ✅ | ✅ | ✅ *(Approval)* | ❌ |
| **Accept or Decline Job Offer** | ❌ | ❌ | ❌ | ✅ |
| **Convert Candidate to Employee** | ✅ | ✅ | ❌ | ❌ |
| **Manage Employee Records & Directory** | ✅ | ✅ | ✅ *(View Only)* | ❌ |
| **Assign & Update Onboarding Tasks**| ✅ | ✅ | ✅ | ✅ *(Own Tasks)* |
| **Request & Approve Leaves** | ✅ *(All)* | ✅ *(Own)* | ✅ *(Dept Approval)*| ❌ |
| **Clock-In / Clock-Out Attendance** | ✅ | ✅ | ✅ | ❌ |
| **Export HR & Compliance Reports** | ✅ | ✅ | ❌ | ❌ |
| **Configure System & Departments** | ✅ | ❌ | ❌ | ❌ |

---

## 📡 REST API Documentation & Endpoint Directory

When the backend is running, complete interactive OpenAPI documentation is available at:
👉 **`http://localhost:3000/api/docs`**

### Summary of REST Endpoints

#### Authentication & User Management
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and receive Bearer JWT token |
| `POST` | `/api/auth/register` | Public | Self-registration for candidate job seekers |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve authenticated user identity and role payload |

#### Dashboard & Analytics
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Admin, Recruiter, Manager | Funnel counts, average time-to-hire, acceptance rate |
| `GET` | `/api/dashboard/recent-activity` | Admin, Recruiter | Immutable log of recent recruitment events |

#### Job Requisitions
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | List published jobs with query filters (department, search) |
| `GET` | `/api/jobs/:id` | Public | Retrieve detailed job specification and requirements |
| `POST` | `/api/jobs` | Admin, Recruiter | Create a new job requisition |
| `PATCH`| `/api/jobs/:id` | Admin, Recruiter | Update status (`PUBLISHED`, `CLOSED`) or details |
| `DELETE`| `/api/jobs/:id` | Admin | Delete requisition |

#### Candidate Applications & ATS Pipeline
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/applications` | Admin, Recruiter, Manager | List applications grouped for Kanban pipeline |
| `POST` | `/api/applications` | Candidate, Public | Submit application with CV file attachment |
| `PATCH`| `/api/applications/:id/status` | Admin, Recruiter, Manager | Update candidate pipeline status (8 stages) |
| `GET` | `/api/applications/my-applications` | Candidate | Candidate self-service application tracker |

#### AI Screening & Human-in-the-Loop Override
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai-screening/screen/:applicationId` | Admin, Recruiter | Dispatch CV to FastAPI engine for parsing and scoring |
| `GET` | `/api/ai-screening/result/:applicationId` | Admin, Recruiter, Manager | Retrieve explainability score and matched/missing skills |
| `PATCH`| `/api/ai-screening/override/:id` | Admin, Recruiter | Human recruiter override (`APPROVED` / `OVERRIDDEN`) |

#### Interviews & Structured Scorecards
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interviews` | Admin, Recruiter, Manager | List scheduled interviews |
| `POST` | `/api/interviews` | Admin, Recruiter | Schedule interview round with Google Meet generation |
| `POST` | `/api/interviews/:id/scorecards` | Admin, Recruiter, Manager | Submit evaluation scorecard (ratings 1–5 & recommendation) |

#### Offer Management & Employee Conversion
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/offers` | Admin, Recruiter | Generate official compensation offer |
| `PATCH`| `/api/offers/:id/approve` | Admin, Manager | Approve/reject offer terms internally |
| `PATCH`| `/api/offers/:id/respond` | Candidate | Candidate accepts or declines extended offer |
| `POST` | `/api/offers/:id/convert-to-employee` | Admin, Recruiter | 1-Click provisioning of active `Employee` record |

#### Core HR Operations (HRIS)
| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/employees` | Admin, Recruiter, Manager | Query directory of company employees |
| `POST` | `/api/employees` | Admin, Recruiter | Add new employee record |
| `GET` | `/api/onboarding` | Authenticated | List onboarding tasks and completion metrics |
| `PATCH`| `/api/onboarding/:id` | Authenticated | Mark onboarding task complete |
| `GET` | `/api/leaves` | Authenticated | View leave balances and request history |
| `POST` | `/api/leaves` | Authenticated | Submit leave request (`ANNUAL`, `SICK`, `UNPAID`) |
| `PATCH`| `/api/leaves/:id/status` | Admin, Manager | Approve or reject submitted leave request |
| `POST` | `/api/attendance/clock-in` | Authenticated | Record daily clock-in timestamp |
| `POST` | `/api/attendance/clock-out` | Authenticated | Record clock-out timestamp and compute total hours |
| `GET` | `/api/reports/analytics` | Admin, Recruiter | Aggregated headcount, turnover, and hiring velocity reports |

---

## 💻 Frontend Interface & Route Directory

The frontend is built with **Next.js 15 (App Router)**, **React 19**, and **Tailwind CSS**, featuring 18 purpose-built views:

```
frontend/src/app/
├── page.tsx                           # Public marketing landing page & role quick switcher
├── login/page.tsx                     # Authentication portal with 1-click demo logins
├── layout.tsx                         # Root layout with AuthProvider & dynamic navigation
├── globals.css                        # Design system & Tailwind styling tokens
│
├── jobs/                              # Public Candidate Job Board
│   ├── page.tsx                       # Filterable job search & listings
│   └── [slug]/page.tsx                # Detailed requisition view & CV upload modal
│
├── candidate/                         # Candidate Self-Service Portal
│   └── applications/page.tsx          # Real-time status tracker, interview links, offer acceptance
│
├── pipeline/                          # ATS Kanban Board
│   └── page.tsx                       # Drag-and-drop 8-column pipeline & AI insight drawer
│
└── dashboard/                         # Internal HR & Recruiter Portal
    ├── page.tsx                       # Executive overview, KPI metric cards, funnel charts
    ├── jobs/page.tsx                  # Requisition creation, status toggles, salary ranges
    ├── interviews/page.tsx            # Multi-round interview calendar & scorecard evaluator
    ├── offers/page.tsx                # Offer generation, approval queue, 1-click employee conversion
    ├── employees/page.tsx             # Staff directory, department filters, status toggles
    ├── onboarding/page.tsx            # New hire onboarding task manager & progress bars
    ├── leaves/page.tsx                # Leave balance ledger, request submission & approvals
    ├── attendance/page.tsx            # Timecard punch clock, daily logs, work hour summaries
    ├── reports/page.tsx               # Headcount distributions, hiring velocity, attrition
    └── settings/page.tsx              # Department hierarchy & system compliance configuration
```

---

## ⚙️ Configuration & Environment Variables

### 1. Backend (`backend/.env`)

```ini
# Application Port
PORT=3000

# Database Connection (Default: SQLite for zero-config development)
DATABASE_URL="file:./dev.db"

# For PostgreSQL in Docker / Production:
# DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/hireflow_ai?schema=public"

# Authentication Security
JWT_SECRET="super-secret-hireflow-key-change-in-prod-2026"
JWT_EXPIRES_IN="7d"

# Microservices Communication
AI_SERVICE_URL="http://localhost:8000"

# Redis Cache (Optional for dev, enabled in docker-compose)
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### 2. Frontend (`frontend/.env.local`)

```ini
# Core Backend API Base URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 3. AI Microservice (`ai-service/.env`)

```ini
PORT=8000
HOST="0.0.0.0"
DEBUG=True
```

---

## 🚀 Step-by-Step Installation & Quickstart

### Method A: Zero-Config Local Development (Fastest, Zero Dependencies)

Run HireFlow AI locally in less than 2 minutes using SQLite without needing Docker or a local PostgreSQL installation.

#### Step 1: Clone the Repository
```bash
git clone https://github.com/ke961/AI-Powered-Recruitment-HR-Management-System.git
cd "AI-Powered-Recruitment-HR-Management-System"
```

#### Step 2: Initialize & Start Backend (NestJS)
```bash
cd backend
npm install
npm run prisma db push
npm run prisma db seed
npm run start:dev
```
*Backend runs on `http://localhost:3000` (Swagger docs available at `http://localhost:3000/api/docs`).*

#### Step 3: Initialize & Start AI Engine (FastAPI)
Open a new terminal window:
```bash
cd ai-service
python -m venv venv

# On Windows:
.\venv\Scripts\activate
# On macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*AI service runs on `http://localhost:8000` (Interactive docs at `http://localhost:8000/docs`).*

#### Step 4: Initialize & Start Frontend (Next.js 15)
Open a third terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to **`http://localhost:3001`**.*

---

### Method B: Full-Stack Docker Compose (Production Parity)

Launch the entire ecosystem (PostgreSQL 16, Redis 7, FastAPI AI Engine, NestJS Backend, and Next.js 15 Frontend) in isolated containers with a single command:

```bash
docker compose up --build
```

#### Running Service Endpoints:
- **Web Application**: `http://localhost:3001`
- **Backend API Gateway**: `http://localhost:3000`
- **Interactive Swagger Documentation**: `http://localhost:3000/api/docs`
- **AI Microservice**: `http://localhost:8000`
- **PostgreSQL Database**: `localhost:5432` (`hireflow_ai`)
- **Redis Cache**: `localhost:6379`

To stop all services:
```bash
docker compose down
```

---

## 🔑 Interactive Sandbox & Demo Credentials

The database is pre-seeded with test accounts across all 4 system roles.

> **Universal Password for all Demo Accounts**: `Password123!`

| Role | Email Address | Ideal For Testing |
| :--- | :--- | :--- |
| **System Admin** | `admin@hireflow.ai` | Complete unrestricted access: departments, compliance, all ATS & HRIS modules |
| **Recruiter** | `recruiter@hireflow.ai` | Managing jobs, drag-and-drop Kanban, AI screening, scheduling, offer generation |
| **Hiring Manager** | `manager@hireflow.ai` | Evaluating candidates, submitting interview scorecards, reviewing department offers |
| **Candidate** | `alex.chen@hireflow.ai` | Browsing job board, tracking applications, reviewing & accepting job offers |

### Recommended End-to-End Test Walkthrough
1. **Visit Job Board**: Go to `http://localhost:3001/jobs` as a visitor or candidate.
2. **Apply with CV**: Select **Senior Full-Stack Engineer** and submit an application with a PDF/Word resume.
3. **Recruiter Review**: Log in as `recruiter@hireflow.ai` at `http://localhost:3001/login` (or use the 1-click switcher).
4. **Inspect Pipeline**: Navigate to `http://localhost:3001/pipeline` to view the candidate in the `APPLIED` column.
5. **AI Resume Screening**: Click **"AI Screen"** to trigger explainable analysis. Inspect the matched vs. missing skills modal.
6. **Schedule Interview**: Advance candidate to `INTERVIEW_SCHEDULED` and assign an interview slot.
7. **Scorecard Submission**: Log in as `manager@hireflow.ai`, evaluate candidate competency ratings (1–5), and submit a `HIRE` recommendation.
8. **Extend Offer**: Log back in as `recruiter@hireflow.ai`, create an offer letter at `/dashboard/offers`.
9. **Candidate Signs Offer**: Log in as `alex.chen@hireflow.ai` at `/candidate/applications` and click **"Accept Offer"**.
10. **1-Click Conversion to Employee**: As Recruiter, click **"Convert to Employee"**. Alex Chen is instantly created as an active staff member in the `/dashboard/employees` directory and assigned onboarding tasks.

---

## 🧪 Testing & Quality Assurance

HireFlow AI includes dedicated test suites for both services and the frontend build pipeline.

### 1. Backend Integration Smoke Test
Tests database seeding, JWT authentication, job postings, candidate applications, interview scorecards, and offer workflows:
```bash
cd backend
node --experimental-strip-types test/smoke-test.ts
```
*Expected Result: `100% Passed (All 16 functional integration checks verified)`.*

### 2. AI Microservice Unit & Parsing Test
Validates PDF/DOCX text extraction, keyword extraction, and heuristic scoring:
```bash
cd ai-service
python test_ai_service.py
```
*Expected Result: `OK (All unit checks and NLP extraction tests passing)`.*

### 3. Frontend Production Build Verification
Verifies TypeScript compilation, route bundling, and Tailwind CSS tree-shaking:
```bash
cd frontend
npm run build
```
*Expected Result: `Generating static pages (18/18) ✓ Final exit code: 0`.*

---

## 🔒 Security, Hardening & Compliance

- **Role Guard Isolation**: All sensitive mutations are guarded by NestJS `@Roles()` decorators with automated payload validation via `class-validator`.
- **Sanitized Multi-Part Uploads**: File uploads are restricted by MIME type (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`) and capped at 10MB to prevent denial-of-service vectors.
- **SQL Injection Prevention**: All queries are parameterized and typed end-to-end via Prisma ORM.
- **Cross-Origin Resource Sharing (CORS)**: Configured for whitelist origins with preflight protection.
- **Audit Logging**: Sensitive operations (e.g. AI score overrides, salary adjustments, offer extensions) record immutable audit entries with timestamps and user IDs.

---

## ❓ Troubleshooting & FAQs

### Q1: The backend command gives `Cannot find module ... nest.js` on Windows
**Cause**: If your directory path contains an ampersand (`&`) or space, standard Windows command shell scripts may split the command.
**Solution**: Run scripts using direct node invocation:
```bash
node node_modules/@nestjs/cli/bin/nest.js start --watch
```
*(All `package.json` scripts in this repository are already configured with robust, quote-safe node executions).*

### Q2: Port 3000, 3001, or 8000 is already in use
**Solution**: Change the assigned port in your `.env` file or terminate the orphaned process:
```powershell
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Q3: How do I switch the backend from SQLite to PostgreSQL?
1. Open `backend/.env`.
2. Change `DATABASE_URL` to your PostgreSQL connection string:
   ```ini
   DATABASE_URL="postgresql://user:password@localhost:5432/hireflow_ai?schema=public"
   ```
3. Copy `backend/prisma/schema.postgresql.prisma` to `backend/prisma/schema.prisma` (or change `provider = "postgresql"`).
4. Run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

---

## 📄 License & Acknowledgments

This project is open-source software licensed under the **[MIT License](LICENSE)**.

Built with dedication for modern talent acquisition leaders and human resource practitioners seeking an ethical, explainable, and unified recruitment operating system.
