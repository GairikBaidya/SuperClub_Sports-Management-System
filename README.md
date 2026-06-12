<div align="center">

<!-- Logo & Title -->
<img src="public/favicon.svg" alt="SuperClub Logo" width="80" />

# SuperClub

### ⚡ Next-Generation Sports Club Management Platform

<p>
  <em>A full-stack sports management system for athlete registration, document processing, and administrative oversight — built with a premium <strong>Obsidian & Gold</strong> design language.</em>
</p>

<br />

<!-- Badges -->
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite 5](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-BaaS-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Zod](https://img.shields.io/badge/Zod-Schema_Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-E8B84B?style=for-the-badge)](LICENSE)
<br />

[Features](#-features) · [Tech Stack](#-tech-stack) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Database Schema](#-database-schema) · [Contributing](#-contributing)

<br />

<!-- Hero Mockup -->
<img src="public/hero_mockup.png" alt="SuperClub — Hero Section Preview" width="800" style="border-radius: 12px;" />
<br />
<sub>↑ Landing page featuring the premium Obsidian & Gold design system with glassmorphic UI cards</sub>

</div>

<br />

---

<br />

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Design System](#-design-system)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

<br />

## 🏟️ About the Project

**SuperClub** is an enterprise-grade sports club management platform engineered for modern sports academies, federations, and clubs. It delivers a seamless end-to-end workflow — from athlete self-registration through multi-step validated forms to a comprehensive administrative dashboard with real-time data, profile drill-downs, and one-click Excel exports.

### The Problem

Sports clubs and academies still rely on paper forms, scattered spreadsheets, and fragmented communication to manage athlete registrations, document verification, and roster management — leading to data loss, delays, and poor athlete experience.

### The Solution

SuperClub digitizes the entire registration pipeline with:
- **Zero-friction athlete onboarding** via an 8-step guided form with real-time validation
- **Automated document management** with browser-side image compression and cloud storage
- **A powerful admin dashboard** for search, filter, drill-down, and bulk export

<br />

## ✨ Features

<table>
<tr>
<td width="50%">

### 🏃 Athlete Registration
- **8-step guided form** with progress tracking
- Real-time field validation (Zod schemas)
- Auto-calculated age from DOB
- Age-group auto-suggestion
- Duplicate detection (mobile & email) on blur
- `localStorage` draft persistence across sessions
- Minor/guardian conditional logic

</td>
<td width="50%">

### 📄 Document Management
- Drag-and-drop + click-to-browse upload zones
- **Automatic image compression** (browser-side, < 1MB)
- PDF validation (size & type enforcement)
- Thumbnail previews for images, file chips for PDFs
- Upload progress indicators
- Conditional insurance document section
- Supabase Storage with signed URLs

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ Admin Dashboard
- Secure login with Supabase Auth
- Protected routes with session validation
- **Summary metric cards** (Total, Submitted, Pending, Draft)
- Paginated data grid (20 rows/page, server-side)
- Full-text search across name, mobile, email
- Multi-filter stacking (status + age group)
- Sortable columns (Name, Date, Status, Age Group)

</td>
<td width="50%">

### 📊 Analytics & Export
- **One-click Excel export** (.xlsx via SheetJS)
- Exports respect active search/filter criteria
- All fields mapped with proper column headers
- Athlete profile drill-down with full data view
- Document viewer with signed URL access
- Status badges with color-coded states
- Real-time data refresh (60s interval)

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Premium UI/UX
- **Obsidian & Gold** design language
- Glassmorphic card components
- Custom typography (Bebas Neue, Barlow, Inter)
- Hero section with dynamic visual elements
- Fully responsive (mobile-first, 375px+)
- WCAG AA contrast compliance

</td>
<td width="50%">

### 🔒 Security
- Row-Level Security (RLS) on all database tables
- Private storage buckets with signed URL access
- Admin-only route protection
- No self-signup for admin accounts
- Zod input sanitization & type stripping
- Environment variable isolation (`.env`)

</td>
</tr>
</table>

<br />

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---:|:---|:---|
| ⚛️ | **React 18** | Component-based UI with hooks & concurrent features |
| ⚡ | **Vite 5** | Lightning-fast HMR dev server & optimized builds |
| 🎨 | **Tailwind CSS 3** | Utility-first styling with custom design tokens |
| 📋 | **React Hook Form** | Performant multi-step form state management |
| 🔐 | **Zod** | Schema-based runtime validation & type inference |
| 🗄️ | **Supabase** | PostgreSQL database, Auth, Storage — all-in-one BaaS |
| 🛣️ | **React Router 6** | Declarative client-side routing & protected routes |
| 🖼️ | **browser-image-compression** | Client-side image optimization before upload |
| 📊 | **SheetJS (xlsx)** | In-browser Excel workbook generation & download |

</div>

<br />

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│                                                                  │
│  ┌──────────────────────────┐   ┌─────────────────────────────┐  │
│  │  🏃 Athlete Registration │   │  🛡️ Admin Panel              │  │
│  │                          │   │  (Protected Routes)          │  │
│  │  • 8-Step Guided Form    │   │  • Dashboard + Metrics       │  │
│  │  • Zod Validation        │   │  • Data Grid + Search        │  │
│  │  • Image Compression     │   │  • Profile Drill-Down        │  │
│  │  • localStorage Draft    │   │  • Excel Export              │  │
│  └────────────┬─────────────┘   └──────────────┬──────────────┘  │
│               │                                │                  │
│               │     @supabase/supabase-js       │                  │
└───────────────┼────────────────────────────────┼──────────────────┘
                │                                │
                ▼                                ▼
┌──────────────────────────────────────────────────────────────────┐
│                         SUPABASE CLOUD                           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────────┐  │
│  │  🔐 Auth     │  │  🗃️ PostgreSQL    │  │  📦 Storage       │  │
│  │              │  │                  │  │                   │  │
│  │  Email/Pass  │  │  athletes        │  │  athlete-photos   │  │
│  │  Session JWT │  │  athlete_docs    │  │  athlete-docs     │  │
│  │  Admin Only  │  │  athlete_insure  │  │  athlete-noc      │  │
│  │              │  │  admin_users     │  │  athlete-insure   │  │
│  │              │  │  (RLS Enabled)   │  │  (Private + URLs) │  │
│  └──────────────┘  └──────────────────┘  └───────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

<br />

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:---|:---|
| **Node.js** | v16.0 or higher |
| **npm** or **yarn** | Latest stable |
| **Supabase Account** | [Free tier available](https://supabase.com/) |

### 1. Clone the Repository

```bash
git clone https://github.com/GairikBaidya/SuperClub_Sports-Management-System.git
cd SuperClub_Sports-Management-System
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Note:** You can find these values in your [Supabase project settings](https://app.supabase.com/) → Settings → API.

### 4. Set Up Supabase Database

Run the SQL migrations from the [PRD database schema](prd.md#4-supabase-database-schema) in your Supabase SQL Editor — this creates all tables, enums, RLS policies, and storage buckets.

### 5. Launch Development Server

```bash
npm run dev
```

### 6. Open in Browser

```
http://localhost:5173
```

<br />

## 📁 Project Structure

```
SuperClub_Sports-Management-System/
│
├── public/                          # Static assets
│   ├── favicon.svg                  # App favicon (SuperClub logo)
│   ├── hero_mockup.png              # Landing page preview image
│   ├── hero_demo.webp               # Animated hero demo
│   └── icons.svg                    # Icon sprite sheet
│
├── src/                             # Application source code
│   │
│   ├── components/                  # Reusable React components
│   │   ├── common/                  # Shared UI primitives
│   │   │   ├── FormField.jsx        # Label + input + error wrapper
│   │   │   ├── HeroSection.jsx      # Landing page hero component
│   │   │   ├── Modal.jsx            # Generic modal (Terms & Conditions)
│   │   │   ├── StatusBadge.jsx      # Color-coded status pill badges
│   │   │   ├── StepIndicator.jsx    # 8-step progress bar
│   │   │   ├── Toast.jsx            # Slide-in notifications
│   │   │   └── UploadZone.jsx       # Drag-and-drop file upload
│   │   │
│   │   ├── registration/            # Multi-step form components
│   │   │   ├── Step1Personal.jsx    # Personal details (name, DOB, etc.)
│   │   │   ├── Step2Guardian.jsx    # Parent/guardian information
│   │   │   ├── Step3Address.jsx     # Address & location
│   │   │   ├── Step4Club.jsx        # Club/state representation + NOC
│   │   │   ├── Step5Competition.jsx # Age group, skill level, events
│   │   │   ├── Step6Documents.jsx   # Mandatory & optional doc uploads
│   │   │   ├── Step7Declaration.jsx # Review summary + consent
│   │   │   └── Step8Payment.jsx     # Payment placeholder (Phase 2)
│   │   │
│   │   └── admin/                   # Admin dashboard components
│   │       ├── AthleteProfileView.jsx  # Full athlete profile display
│   │       ├── DataTable.jsx           # Paginated data grid
│   │       └── SummaryCard.jsx         # Dashboard metric cards
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAdmin.js              # Admin auth state management
│   │   ├── useDuplicateCheck.js     # Async mobile/email uniqueness
│   │   └── useFormPersistence.js    # localStorage draft hydration
│   │
│   ├── lib/                         # Utility libraries & helpers
│   │   ├── constants.js             # App-wide constants & config
│   │   ├── exportExcel.js           # SheetJS Excel export utility
│   │   ├── imageCompression.js      # Browser-side image optimizer
│   │   ├── supabaseClient.js        # Supabase client initialization
│   │   └── uploadDocument.js        # Storage upload + signed URL helper
│   │
│   ├── pages/                       # Route-level page components
│   │   ├── LandingPage.jsx          # Public landing/hero page
│   │   ├── LandingPage.css          # Landing page styles
│   │   ├── RegistrationPage.jsx     # Multi-step form orchestrator
│   │   ├── SuccessPage.jsx          # Post-registration confirmation
│   │   └── admin/                   # Admin section pages
│   │       ├── LoginPage.jsx        # Admin authentication
│   │       ├── DashboardPage.jsx    # Main admin dashboard
│   │       └── AthleteDetailPage.jsx # Individual athlete profile
│   │
│   ├── routes/                      # Routing configuration
│   │   ├── AppRouter.jsx            # Route definitions & layout
│   │   └── ProtectedRoute.jsx       # Auth guard for admin routes
│   │
│   ├── schemas/                     # Zod validation schemas
│   │   ├── step1Schema.js           # Personal details validation
│   │   ├── step2Schema.js           # Guardian details validation
│   │   ├── step3Schema.js           # Address validation
│   │   ├── step4Schema.js           # Club details validation
│   │   ├── step5Schema.js           # Competition details validation
│   │   ├── step6Schema.js           # Document upload validation
│   │   └── step7Schema.js           # Declaration/consent validation
│   │
│   ├── App.jsx                      # Root application component
│   ├── index.css                    # Global styles & Tailwind directives
│   └── main.jsx                     # Application entry point
│
├── .env                             # Environment variables (git-ignored)
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind theme & design tokens
└── vite.config.js                   # Vite build configuration
```

<br />

## 🗃️ Database Schema

SuperClub uses a relational PostgreSQL database hosted on Supabase with Row-Level Security (RLS) enabled on every table.

### Entity Relationship Overview

```
┌─────────────────┐       ┌───────────────────────┐
│    athletes      │       │   athlete_documents    │
│─────────────────│       │───────────────────────│
│ id (PK, UUID)   │◄──┐   │ id (PK, UUID)         │
│ full_name       │   │   │ athlete_id (FK) ──────┤
│ date_of_birth   │   │   │ doc_type (ENUM)       │
│ age (GENERATED) │   │   │ file_url              │
│ gender          │   │   │ doc_status            │
│ blood_group     │   ├───│ uploaded_at            │
│ mobile_number   │   │   └───────────────────────┘
│ email           │   │
│ registration_   │   │   ┌───────────────────────┐
│   status        │   │   │   athlete_insurance    │
│ form_step_      │   │   │───────────────────────│
│   completed     │   │   │ id (PK, UUID)         │
│ ...             │   └───│ athlete_id (FK) ──────┤
└─────────────────┘       │ provider_name         │
                          │ policy_number         │
┌─────────────────┐       │ valid_till            │
│   admin_users    │       └───────────────────────┘
│─────────────────│
│ id (PK, FK→Auth)│
│ email           │
│ full_name       │
└─────────────────┘
```

### Core Tables

| Table | Purpose | RLS Policy |
|:---|:---|:---|
| `athletes` | Primary registration records (personal, guardian, address, club, competition data) | Public INSERT · Admin SELECT/UPDATE |
| `athlete_documents` | Uploaded document metadata & Supabase Storage URLs | Public INSERT · Admin SELECT/UPDATE |
| `athlete_insurance` | Conditional insurance policy details | Public INSERT · Admin SELECT |
| `admin_users` | Admin profile data (linked to Supabase Auth) | Own-profile SELECT only |

### Custom Enums

| Enum | Values |
|:---|:---|
| `gender_type` | Male · Female · Other · Prefer not to say |
| `blood_group_type` | A+ · A− · B+ · B− · AB+ · AB− · O+ · O− · Unknown |
| `skill_level_type` | Beginner · Intermediate · Advanced |
| `reg_status_type` | Draft · Submitted · Under Review · Approved · Rejected |
| `age_group_type` | U-8 · U-10 · U-12 · U-14 · U-16 · U-18 · U-21 · Senior · Open |

<br />

## 🔑 Environment Variables

| Variable | Required | Description |
|:---|:---:|:---|
| `VITE_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Public anonymous API key (safe with RLS) |

> ⚠️ Never commit `.env` to version control. The `.gitignore` is pre-configured to exclude it.

<br />

## 📜 Available Scripts

| Command | Description |
|:---|:---|
| `npm run dev` | Start the Vite development server with HMR |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the codebase |

<br />

## 🎨 Design System

SuperClub implements a custom **Obsidian & Gold** design language — a premium dark-theme aesthetic with gold accent tones.

### Color Palette

| Token | Hex | Usage |
|:---|:---|:---|
| **Gold 400** | `#E8B84B` | Primary actions, CTAs, active states |
| **Gold 200** | `#F5D07A` | Highlights, hover accents |
| **Gold 700** | `#D4940A` | Pressed states, deeper accents |
| **Obsidian** | `#0A0A0A` | Background surfaces |
| **Surface** | `rgba(255,255,255,0.05)` | Card backgrounds (glass effect) |

### Typography

| Font | Weight | Usage |
|:---|:---|:---|
| **Bebas Neue** | Regular | Display headings, hero text |
| **Barlow** | 400–700 | Body text, form labels |
| **Barlow Condensed** | 500–600 | Navigation, badges, compact UI |
| **Inter** | 400–600 | System fallback, data tables |

### Component Library

| Component | File | Description |
|:---|:---|:---|
| `<StepIndicator>` | `StepIndicator.jsx` | 8-step progress bar with active/completed/upcoming states |
| `<FormField>` | `FormField.jsx` | Input wrapper with label, validation error, and styling |
| `<UploadZone>` | `UploadZone.jsx` | Drag-and-drop file upload with preview & compression |
| `<StatusBadge>` | `StatusBadge.jsx` | Color-coded pills (Draft/Submitted/Approved/Rejected) |
| `<Toast>` | `Toast.jsx` | Slide-in notification system (success/error/info) |
| `<Modal>` | `Modal.jsx` | Overlay modal for Terms & Conditions |
| `<DataTable>` | `DataTable.jsx` | Sortable, filterable, paginated data grid |
| `<SummaryCard>` | `SummaryCard.jsx` | Dashboard metric card with icon & count |

<br />

## 🔒 Security

| Measure | Implementation |
|:---|:---|
| **Route Protection** | `<ProtectedRoute>` checks `supabase.auth.getSession()` before rendering admin views |
| **Row-Level Security** | RLS policies on all 4 tables — athletes can INSERT, only admins can SELECT/UPDATE |
| **Private Storage** | All document buckets are private; access via time-limited signed URLs only |
| **No Admin Self-Signup** | Admin accounts are provisioned exclusively through the Supabase dashboard |
| **Input Sanitization** | Zod schemas strip unknown fields and enforce strict type validation |
| **Duplicate Prevention** | Real-time async checks on mobile number and email (on blur + on submit) |
| **Env Var Isolation** | Supabase credentials stored in `.env`, excluded from version control |

<br />

## 🗺️ Roadmap

SuperClub follows a phased delivery model. Phase 1 (current) establishes the core registration and admin pipeline.

### ✅ Phase 1 — Foundation (Current)
- [x] Multi-step athlete registration form (8 steps)
- [x] Browser-side image compression & Supabase Storage uploads
- [x] Supabase database schema with RLS policies
- [x] Admin authentication & protected routes
- [x] Admin dashboard with data grid, search, filters, pagination
- [x] Athlete profile drill-down view
- [x] Excel export (.xlsx) with active filter support

### 🔮 Phase 2 — Planned
- [ ] Payment gateway integration (Razorpay / UPI / Cards)
- [ ] OTP & email verification for athletes
- [ ] Coach registration and profile management
- [ ] Competition creation & management module
- [ ] Document approval/rejection workflow for admins
- [ ] Email & SMS notification system
- [ ] PIN-code-to-state auto-detection
- [ ] Achievement & certificate management module

<br />

## 🤝 Contributing

Contributions are what make the open-source community an incredible place to learn, inspire, and create. Any contribution you make is **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with clear messages
   ```bash
   git commit -m "feat: add athlete search by age group"
   ```
4. **Push** to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** — describe your changes and link any relevant issues

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/GairikBaidya/SuperClub_Sports-Management-System/issues/new) with a clear description, steps to reproduce (for bugs), and expected behavior.

<br />

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<br />

---

<div align="center">

<br />

**Built with ❤️ by [Gairik Baidya](https://github.com/GairikBaidya)**

<br />

<a href="https://github.com/GairikBaidya/SuperClub_Sports-Management-System">
  <img src="https://img.shields.io/badge/⭐_Star_this_repo-E8B84B?style=for-the-badge" alt="Star this repo" />
</a>

<br /><br />

<sub>© 2026 SuperClub. All rights reserved.</sub>

</div>
