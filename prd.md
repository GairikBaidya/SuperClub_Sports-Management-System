# Product Requirements Document (PRD)

## SuperClub — Sports Club Management Platform — Phase 1

**Website Name:** SuperClub  
**Version:** 1.0  
**Status:** Approved for Development  
**Date:** April 2026  
**Tech Stack:** ReactJS · Tailwind CSS · Supabase (Auth + DB + Storage)  
**IDE / UI Tools:** Google Project IDX (Antigravity IDE) · Google Stitch

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope & Out-of-Scope](#2-scope--out-of-scope)
3. [Tech Stack & Architecture](#3-tech-stack--architecture)
4. [Supabase Database Schema](#4-supabase-database-schema)
5. [Feature 1 — Athlete Registration Form](#5-feature-1--athlete-registration-form)
6. [Feature 2 — File Uploads & Auto-Compression](#6-feature-2--file-uploads--auto-compression)
7. [Feature 3 — Admin Authentication](#7-feature-3--admin-authentication)
8. [Feature 4 — Admin Dashboard & Data Grid](#8-feature-4--admin-dashboard--data-grid)
9. [Feature 5 — Export to Excel / CSV](#9-feature-5--export-to-excel--csv)
10. [API / Supabase RPC Reference](#10-api--supabase-rpc-reference)
11. [Validation Rules Master List](#11-validation-rules-master-list)
12. [UI/UX & Design System](#12-uiux--design-system)
13. [Security Requirements](#13-security-requirements)
14. [Folder Structure](#14-folder-structure)
15. [Acceptance Criteria & QA Checklist](#15-acceptance-criteria--qa-checklist)
16. [Milestones & Delivery Timeline](#16-milestones--delivery-timeline)
17. [Open Questions & Assumptions](#17-open-questions--assumptions)

---

## 1. Executive Summary

Phase 1 establishes the entire **data pipeline** for the Sports Club Management platform: an athlete can self-register through a validated multi-step form, upload required documents, and have their data persisted in Supabase. An admin can log in, browse a real-time grid of all registrations, drill into any athlete's full profile, and export the roster to Excel — all without any paid third-party services.

**Phase 1 Deliverables at a Glance**

| #   | Deliverable                                                 | Owner                       |
| --- | ----------------------------------------------------------- | --------------------------- |
| 1   | Multi-step Athlete Registration Form (8 steps)              | Frontend + Backend          |
| 2   | File upload pipeline with browser-side auto-compression     | Frontend + Supabase Storage |
| 3   | Supabase relational DB schema (all tables + RLS policies)   | Backend                     |
| 4   | Admin Login (Supabase Auth)                                 | Frontend + Backend          |
| 5   | Admin Dashboard — athlete data grid with profile drill-down | Frontend                    |
| 6   | Export to Excel / CSV                                       | Frontend                    |

---

## 2. Scope & Out-of-Scope

### In Scope (Phase 1)

- Athlete multi-step registration form (Steps 1–7; Step 8 Payment is a placeholder UI only)
- Document uploads (mandatory + optional) stored in Supabase Storage
- Browser-side image compression before upload
- Supabase database tables, foreign keys, RLS policies
- Admin login via Supabase Auth (email + password)
- Admin dashboard: paginated data grid, search, filters, profile view
- Export to Excel (.xlsx) and CSV

### Out of Scope (Deferred to Later Phases)

- Payment gateway integration (UPI / Cards / Net Banking)
- OTP / Email verification for athletes
- Coach registration and profiles
- Competition creation and management by admin
- Document approval/rejection workflow (admin marks Approved/Rejected)
- Email & SMS notification system
- Achievement & Certificate module
- Mobile app (iOS / Android)
- PIN-code-to-state auto-detection API (noted, deferred)

---

## 3. Tech Stack & Architecture

### Frontend

| Concern           | Choice                                                     |
| ----------------- | ---------------------------------------------------------- |
| Framework         | React 18 (Vite)                                            |
| Styling           | Tailwind CSS v3                                            |
| UI Build          | Google Stitch (for component scaffolding)                  |
| IDE               | Google Project IDX (Antigravity)                           |
| Form State        | React Hook Form v7                                         |
| Validation        | Zod (schema-based, pairs with React Hook Form)             |
| Image Compression | `browser-image-compression` (npm, free, zero dependencies) |
| Excel Export      | `xlsx` (SheetJS Community Edition — free)                  |
| Routing           | React Router v6                                            |
| Supabase Client   | `@supabase/supabase-js` v2                                 |

### Backend / Infrastructure

| Concern      | Choice                                                       |
| ------------ | ------------------------------------------------------------ |
| Database     | Supabase (PostgreSQL)                                        |
| Auth         | Supabase Auth (email/password for admin)                     |
| File Storage | Supabase Storage (public & private buckets)                  |
| API          | Supabase auto-generated REST + Realtime                      |
| Hosting      | Supabase Edge Functions (if any server-side logic is needed) |

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        BROWSER                          │
│                                                         │
│  ┌──────────────┐         ┌──────────────────────────┐  │
│  │  Athlete     │         │  Admin Panel             │  │
│  │  Registration│         │  (Protected Route)       │  │
│  │  Form        │         │  • Data Grid             │  │
│  │  (8 Steps)   │         │  • Profile Drill-down    │  │
│  │              │         │  • Excel Export          │  │
│  └──────┬───────┘         └────────────┬─────────────┘  │
│         │                              │                 │
│  browser-image-compression             │                 │
│         │                              │                 │
└─────────┼──────────────────────────────┼─────────────────┘
          │                              │
          ▼                              ▼
┌─────────────────────────────────────────────────────────┐
│                     SUPABASE                            │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Auth        │  │  PostgreSQL  │  │  Storage      │  │
│  │  (Admin      │  │  Database    │  │  Buckets      │  │
│  │   Login)     │  │  (RLS)       │  │  (documents)  │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Supabase Database Schema

> Run these SQL statements in the Supabase SQL Editor in order.

### 4.1. Extensions & Enums

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE gender_type        AS ENUM ('Male', 'Female', 'Other', 'Prefer not to say');
CREATE TYPE blood_group_type   AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown');
CREATE TYPE skill_level_type   AS ENUM ('Beginner', 'Intermediate', 'Advanced');
CREATE TYPE doc_status_type    AS ENUM ('Pending', 'Approved', 'Rejected');
CREATE TYPE reg_status_type    AS ENUM ('Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected');
CREATE TYPE age_group_type     AS ENUM ('U-8','U-10','U-12','U-14','U-16','U-18','U-21','Senior','Open');
```

### 4.2. Core Tables

```sql
-- ────────────────────────────────────────────────
-- TABLE: athletes
-- Primary record for each registered athlete.
-- ────────────────────────────────────────────────
CREATE TABLE athletes (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Step 1: Personal Details
  full_name             TEXT NOT NULL,
  date_of_birth         DATE NOT NULL,
  age                   INT GENERATED ALWAYS AS (
                          DATE_PART('year', AGE(date_of_birth))::INT
                        ) STORED,
  gender                gender_type NOT NULL,
  blood_group           blood_group_type NOT NULL DEFAULT 'Unknown',
  mobile_number         TEXT NOT NULL UNIQUE,
  email                 TEXT NOT NULL UNIQUE,

  -- Step 2: Guardian Details
  father_name           TEXT,
  mother_name           TEXT,
  guardian_name         TEXT,
  guardian_mobile       TEXT,
  guardian_email        TEXT,

  -- Step 3: Address Details
  current_address       TEXT NOT NULL,
  city                  TEXT NOT NULL,
  state                 TEXT NOT NULL,
  pin_code              TEXT NOT NULL,
  country               TEXT NOT NULL DEFAULT 'India',

  -- Step 4: Club / Representation
  club_name             TEXT,
  state_representation  TEXT,
  district              TEXT,

  -- Step 5: Competition Details
  age_group             age_group_type,
  skill_level           skill_level_type,
  events_applied        TEXT[],                -- Array of event/competition names

  -- Step 7: Declaration
  declaration_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  terms_agreed          BOOLEAN NOT NULL DEFAULT FALSE,
  guardian_consent      BOOLEAN,               -- Mandatory if age < 18

  -- Meta
  registration_status   reg_status_type NOT NULL DEFAULT 'Draft',
  form_step_completed   INT NOT NULL DEFAULT 0  -- Tracks last completed step (1-8)
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_athletes_updated_at
BEFORE UPDATE ON athletes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

```sql
-- ────────────────────────────────────────────────
-- TABLE: athlete_documents
-- Stores metadata & Supabase Storage URLs for all
-- uploaded files per athlete.
-- ────────────────────────────────────────────────
CREATE TYPE doc_type AS ENUM (
  'passport_photo',
  'aadhaar_card',
  'birth_certificate',
  'school_bonafide',
  'noc_club',
  'noc_state',
  'insurance_document',
  'achievement_certificate',
  'medical_fitness'
);

CREATE TABLE athlete_documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id      UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  doc_type        doc_type NOT NULL,
  file_name       TEXT NOT NULL,
  file_url        TEXT NOT NULL,              -- Supabase Storage public/signed URL
  file_size_bytes INT,
  mime_type       TEXT,
  doc_status      doc_status_type NOT NULL DEFAULT 'Pending',
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ,
  review_notes    TEXT
);
```

```sql
-- ────────────────────────────────────────────────
-- TABLE: athlete_insurance
-- Conditional: stored only when insurance is
-- required for the competition applied.
-- ────────────────────────────────────────────────
CREATE TABLE athlete_insurance (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id        UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  provider_name     TEXT NOT NULL,
  policy_number     TEXT NOT NULL,
  valid_till        DATE NOT NULL,
  document_id       UUID REFERENCES athlete_documents(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

```sql
-- ────────────────────────────────────────────────
-- TABLE: admin_users
-- Managed via Supabase Auth. This table stores
-- additional profile info for admin accounts.
-- ────────────────────────────────────────────────
CREATE TABLE admin_users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 4.3. Row-Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE athletes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_documents   ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_insurance   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;

-- ─── Athletes table ───────────────────────────────
-- Allow public INSERT (athlete self-registration, no login required)
CREATE POLICY "Public can insert athletes"
  ON athletes FOR INSERT
  WITH CHECK (true);

-- Athletes can read/update only their own row (matched by email — no auth in Phase 1)
-- Admins (authenticated users) can read all rows
CREATE POLICY "Admin can read all athletes"
  ON athletes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update athletes"
  ON athletes FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ─── Documents ────────────────────────────────────
CREATE POLICY "Public can insert documents"
  ON athlete_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read all documents"
  ON athlete_documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update documents"
  ON athlete_documents FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ─── Insurance ────────────────────────────────────
CREATE POLICY "Public can insert insurance"
  ON athlete_insurance FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can read all insurance"
  ON athlete_insurance FOR SELECT
  USING (auth.role() = 'authenticated');

-- ─── Admin Users ──────────────────────────────────
CREATE POLICY "Admin can read own profile"
  ON admin_users FOR SELECT
  USING (auth.uid() = id);
```

### 4.4. Supabase Storage Buckets

| Bucket Name         | Visibility | Purpose                              |
| ------------------- | ---------- | ------------------------------------ |
| `athlete-photos`    | Private    | Passport-size photos                 |
| `athlete-documents` | Private    | Aadhaar, Birth Cert, School Bonafide |
| `athlete-noc`       | Private    | NOC documents (Club & State)         |
| `athlete-insurance` | Private    | Insurance PDFs                       |
| `athlete-optional`  | Private    | Achievement certs, medical certs     |

All buckets must be set to **Private** with signed URL access so documents are never publicly accessible without authentication.

---

## 5. Feature 1 — Athlete Registration Form

### 5.1. High-Level Form Flow

```
[Step 1]         [Step 2]          [Step 3]       [Step 4]
Personal    ──►  Guardian    ──►   Address   ──►  Club/State
Details          Details           Details        Details
                                                      │
                                                      ▼
[Step 8]         [Step 7]          [Step 6]       [Step 5]
Payment     ◄──  Declaration ◄──   Documents  ◄── Competition
(Placeholder)    & Consent         Upload         Details
```

A **progress bar** at the top must visually reflect the current step (e.g., Step 3 of 8). A step is marked complete only after passing all validations for that step. Users can navigate backwards freely. The form auto-saves to `localStorage` after each completed step so progress is not lost on accidental refresh.

### 5.2. Step-by-Step Field Specification

#### Step 1: Personal Details

| Field         | Type           | Validation                                      | Notes                                           |
| ------------- | -------------- | ----------------------------------------------- | ----------------------------------------------- |
| Full Name     | Text input     | Required; min 3 chars; letters + spaces only    | As per official documents                       |
| Date of Birth | Date picker    | Required; must be ≥ 5 years ago, ≤ 80 years ago | Triggers age auto-calculation                   |
| Age           | Read-only text | Auto-calculated from DOB                        | Display only; stored as computed column in DB   |
| Gender        | Dropdown       | Required                                        | Options: Male, Female, Other, Prefer not to say |
| Blood Group   | Dropdown       | Required                                        | Options per enum; default "Unknown"             |
| Mobile Number | Text input     | Required; exactly 10 digits; numeric only       | Stored & checked for duplicates                 |
| Email Address | Text input     | Required; valid email format                    | Stored & checked for duplicates                 |

**Duplicate Check Logic:** On blur of Mobile and Email fields, trigger a Supabase query to check if the value already exists in the `athletes` table. Show an inline error immediately if a duplicate is found — do not wait for form submission.

#### Step 2: Parent / Guardian Details

| Field           | Type       | Validation                               | Notes                                                 |
| --------------- | ---------- | ---------------------------------------- | ----------------------------------------------------- |
| Father's Name   | Text input | Optional (Required if age < 18)          | —                                                     |
| Mother's Name   | Text input | Optional                                 | —                                                     |
| Guardian Name   | Text input | Optional                                 | Show only if "Guardian applicable" checkbox is ticked |
| Guardian Mobile | Text input | Required if age < 18; 10 digits          | —                                                     |
| Guardian Email  | Text input | Optional; valid email format if provided | —                                                     |

**Conditional Rule:** If the athlete's age (calculated in Step 1) is under 18, Father's Name and Guardian Mobile become mandatory, and a blue info banner must read: _"Since the athlete is a minor, parent/guardian details are mandatory."_

#### Step 3: Address Details

| Field           | Type       | Validation                          | Notes                                            |
| --------------- | ---------- | ----------------------------------- | ------------------------------------------------ |
| Current Address | Textarea   | Required; min 10 chars              | Full address including landmark                  |
| City / District | Text input | Required                            | —                                                |
| State           | Text input | Required                            | Manual entry (PIN→State API deferred to Phase 2) |
| PIN Code        | Text input | Required; exactly 6 digits; numeric | —                                                |
| Country         | Text input | Required; default "India"           | Pre-filled                                       |

#### Step 4: Club / State Representation

| Field                   | Type        | Validation                          | Notes                    |
| ----------------------- | ----------- | ----------------------------------- | ------------------------ |
| Club Name               | Text input  | Optional                            | —                        |
| State Representation    | Text input  | Optional                            | —                        |
| District                | Text input  | Optional                            | —                        |
| NOC — Club              | File upload | Optional in Phase 1 (PDF, max 2 MB) | Upload zone with preview |
| NOC — State Association | File upload | Optional in Phase 1 (PDF, max 2 MB) | Upload zone with preview |

#### Step 5: Competition Details

| Field                 | Type                      | Validation          | Notes                                                               |
| --------------------- | ------------------------- | ------------------- | ------------------------------------------------------------------- |
| Age Group Applied For | Dropdown (auto-suggested) | Required            | Auto-suggest based on DOB; user can confirm or override             |
| Category / Level      | Dropdown                  | Required            | Beginner / Intermediate / Advanced                                  |
| Event / Competition   | Multi-select checkboxes   | At least 1 required | List of available events (hardcoded in Phase 1; dynamic in Phase 2) |

**Age Group Auto-Suggestion Logic (Frontend):**

```
Age < 8  → U-8
Age 8-9  → U-10
Age 10-11 → U-12
Age 12-13 → U-14
Age 14-15 → U-16
Age 16-17 → U-18
Age 18-20 → U-21
Age 21-35 → Senior
Age > 35  → Open
```

Pre-select the matching group in the dropdown but allow the athlete to change it.

#### Step 6: Document Upload Section

**Upload Component Requirements (applies to all fields in this step):**

- Drag-and-drop zone + click-to-browse
- Thumbnail preview for images; file-name + size chip for PDFs
- "Remove" (×) button visible on each uploaded file
- Progress indicator while uploading to Supabase Storage
- Display toast: _"Your image has been optimized for faster upload"_ when compression occurs

**Mandatory Uploads:**

| Document                      | Accepted Formats    | Max Size                 | Notes                                      |
| ----------------------------- | ------------------- | ------------------------ | ------------------------------------------ |
| Passport Size Photo           | JPG, JPEG, PNG      | 1 MB (after compression) | Compressed via `browser-image-compression` |
| Aadhaar Card / ID Proof       | JPG, JPEG, PNG, PDF | 2 MB                     | —                                          |
| Birth Certificate / DOB Proof | JPG, JPEG, PNG, PDF | 2 MB                     | —                                          |
| School Bonafide Certificate   | JPG, JPEG, PNG, PDF | 2 MB                     | —                                          |

**Insurance Section (Conditional):**

Show this section with a warning banner _"⚠️ Insurance is required to participate in this competition"_ only when the selected event in Step 5 has insurance flagged as required. In Phase 1, this can be hardcoded as `isInsuranceRequired: true` for at least one mock event to test the conditional logic.

| Field                   | Type                          | Validation                      |
| ----------------------- | ----------------------------- | ------------------------------- |
| Insurance Provider Name | Text input                    | Required if section visible     |
| Policy Number           | Text input                    | Required if section visible     |
| Valid Till (Expiry)     | Date picker                   | Required; must be a future date |
| Insurance Document      | File upload (PDF/Image, 2 MB) | Required if section visible     |

**Optional Uploads:**

| Document                          | Accepted Formats    | Max Size  |
| --------------------------------- | ------------------- | --------- |
| Previous Achievement Certificates | JPG, JPEG, PNG, PDF | 2 MB each |
| Medical Fitness Certificate       | JPG, JPEG, PNG, PDF | 2 MB      |

#### Step 7: Declaration & Consent

| Element                             | Type     | Validation            | Notes                 |
| ----------------------------------- | -------- | --------------------- | --------------------- |
| "I confirm all details are correct" | Checkbox | Must be checked       | —                     |
| "I agree to terms and conditions"   | Checkbox | Must be checked       | Link to a Terms modal |
| Parent/Guardian Consent             | Checkbox | Mandatory if age < 18 | Dynamically shown     |

A read-only summary of key submitted details (Name, DOB, Email, Club, Events) should be displayed above the checkboxes so the athlete can review before final submission.

#### Step 8: Payment (Phase 1 — Placeholder Only)

- Display a static card showing: Registration Fee Amount (hardcoded as ₹500 for Phase 1)
- Show a disabled "Proceed to Payment" button with a badge: _"Coming Soon — Payment Gateway Integration in Phase 2"_
- On clicking the **Submit Registration** button (separate from payment), set `registration_status = 'Submitted'` and `form_step_completed = 8` in the DB
- Show a **success screen** with a confirmation message and a unique registration reference number (the `athlete.id` UUID, shortened)

### 5.3. State Management Strategy

Use React Hook Form's `useForm` with Zod resolvers. Persist each step's data to `localStorage` under the key `scm_registration_draft`. On component mount, hydrate the form from `localStorage` if data exists. Clear `localStorage` on successful final submission.

```javascript
// Pseudocode — localStorage persistence
const savedDraft = localStorage.getItem("scm_registration_draft");
if (savedDraft) {
  const parsed = JSON.parse(savedDraft);
  methods.reset(parsed);
}

// On step completion
localStorage.setItem(
  "scm_registration_draft",
  JSON.stringify(methods.getValues()),
);
```

### 5.4. Submission Flow (Data to Supabase)

```
User clicks "Next" on Step 7 (Declaration)
        │
        ▼
1. Validate all fields via Zod schema
        │
        ▼
2. INSERT row into `athletes` table
   → Receive athlete UUID
        │
        ▼
3. For each uploaded document:
   a. Upload file blob to Supabase Storage bucket
   b. Receive public/signed URL
   c. INSERT row into `athlete_documents` (athlete_id + url + doc_type)
        │
        ▼
4. If insurance filled:
   INSERT row into `athlete_insurance`
        │
        ▼
5. UPDATE athletes SET registration_status = 'Submitted',
   form_step_completed = 8
        │
        ▼
6. Clear localStorage draft
        │
        ▼
7. Show success screen with registration reference
```

---

## 6. Feature 2 — File Uploads & Auto-Compression

### 6.1. Image Compression (browser-image-compression)

Apply compression **only to image files** (JPG, JPEG, PNG) before upload. PDFs must never be compressed.

```javascript
import imageCompression from "browser-image-compression";

const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // Hard limit: 1 MB
    maxWidthOrHeight: 1024, // Resize to max 1024px on longest side
    useWebWorker: true, // Non-blocking
    fileType: file.type,
    initialQuality: 0.75, // 70–80% quality as per spec
  };

  const compressed = await imageCompression(file, options);
  return compressed;
};
```

After compression, check if the resulting file size is ≤ 1 MB. If the file was compressed, show the toast: _"✅ Your image has been optimized for faster upload"_. If original was already within limits, upload without compression and show no toast.

### 6.2. PDF Validation (No Compression)

```javascript
const validatePDF = (file) => {
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are accepted for this field.");
  }
  if (file.size > 2 * 1024 * 1024) {
    // 2 MB in bytes
    throw new Error("PDF file must be under 2 MB.");
  }
  return true;
};
```

### 6.3. Supabase Storage Upload Pattern

```javascript
const uploadDocument = async (file, athleteId, docType) => {
  const fileExt = file.name.split(".").pop();
  const filePath = `${athleteId}/${docType}_${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("athlete-documents")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  // Get a signed URL valid for 1 year (for admin viewing)
  const { data: signedUrl } = await supabase.storage
    .from("athlete-documents")
    .createSignedUrl(filePath, 60 * 60 * 24 * 365);

  return signedUrl.signedUrl;
};
```

---

## 7. Feature 3 — Admin Authentication

### 7.1. Setup

Admins are created manually in the Supabase Dashboard under Authentication → Users. No self-signup flow is exposed for admins.

After creating the user in Supabase Auth, insert a matching row in `admin_users`:

```sql
INSERT INTO admin_users (id, email, full_name)
VALUES ('<auth_user_uuid>', 'admin@club.com', 'Club Administrator');
```

### 7.2. Admin Login Page (`/admin/login`)

**UI Elements:**

- SuperClub logo / name centered at top
- Email input field
- Password input field (with show/hide toggle)
- "Login" button
- Error message area (invalid credentials, network errors)
- No "Forgot Password" in Phase 1 (handled manually via Supabase dashboard)

**Auth Flow:**

```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: formValues.email,
  password: formValues.password,
});

if (error) {
  // Show: "Invalid email or password. Please try again."
} else {
  // Verify user exists in admin_users table (extra guard)
  const { data: adminCheck } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .single();

  if (!adminCheck) {
    await supabase.auth.signOut();
    // Show: "You are not authorized as an admin."
  } else {
    navigate("/admin/dashboard");
  }
}
```

### 7.3. Protected Route

All `/admin/*` routes must be wrapped in a `<ProtectedRoute>` component that checks `supabase.auth.getSession()`. If no active session exists, redirect to `/admin/login`.

### 7.4. Session Persistence

Supabase Auth persists session in `localStorage` by default. The admin remains logged in across browser refreshes until they click "Logout" or the token expires (default: 1 hour; configurable in Supabase dashboard — recommended: set to 8 hours for admin convenience).

---

## 8. Feature 4 — Admin Dashboard & Data Grid

### 8.1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────┐
│  [SuperClub Logo]  SuperClub Admin       [Logout]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Total    │  │Submitted │  │ Pending  │              │
│  │Athletes  │  │          │  │ Review   │              │
│  │  [N]     │  │  [N]     │  │  [N]     │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│  ┌─ Search ──────────┐  [Filter: Status ▼] [Age Group ▼]│
│  │ Search by name,   │  [ Export to Excel ]             │
│  │ mobile, email...  │                                  │
│  └───────────────────┘                                  │
│                                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Name │ Mobile │ Email │ Age Group │ Events │ Status│  │
│  ├──────┴────────┴───────┴───────────┴────────┴───────┤  │
│  │ Row 1...                                  [View →] │  │
│  │ Row 2...                                  [View →] │  │
│  │ ...                                               │  │
│  └────────────────────────────────────────────────────┘  │
│               [ < Prev ]  Page 1 of N  [ Next > ]        │
└─────────────────────────────────────────────────────────┘
```

### 8.2. Summary Cards (Top of Dashboard)

Fetch these aggregates from Supabase on page load (and refresh every 60 seconds or on manual refresh):

| Card           | Query                                                                      |
| -------------- | -------------------------------------------------------------------------- |
| Total Athletes | `SELECT COUNT(*) FROM athletes`                                            |
| Submitted      | `SELECT COUNT(*) FROM athletes WHERE registration_status = 'Submitted'`    |
| Under Review   | `SELECT COUNT(*) FROM athletes WHERE registration_status = 'Under Review'` |
| Pending/Draft  | `SELECT COUNT(*) FROM athletes WHERE registration_status = 'Draft'`        |

### 8.3. Data Grid Specification

**Columns:**

| Column         | Source Field                   | Sortable | Notes                   |
| -------------- | ------------------------------ | -------- | ----------------------- |
| #              | Row number                     | No       | 1-based index           |
| Full Name      | `athletes.full_name`           | Yes      | —                       |
| Mobile         | `athletes.mobile_number`       | No       | —                       |
| Email          | `athletes.email`               | No       | —                       |
| Age Group      | `athletes.age_group`           | Yes      | —                       |
| Events Applied | `athletes.events_applied`      | No       | Comma-joined array      |
| Reg. Date      | `athletes.created_at`          | Yes      | Formatted as DD/MM/YYYY |
| Status         | `athletes.registration_status` | Yes      | Colored badge           |
| Actions        | —                              | No       | [View Profile] button   |

**Status Badge Colors:**

| Status       | Color        |
| ------------ | ------------ |
| Draft        | Gray         |
| Submitted    | Blue         |
| Under Review | Yellow/Amber |
| Approved     | Green        |
| Rejected     | Red          |

**Pagination:** 20 rows per page. Use Supabase `range()` for server-side pagination.

```javascript
const { data, count } = await supabase
  .from("athletes")
  .select("*", { count: "exact" })
  .order("created_at", { ascending: false })
  .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1);
```

**Search:** Client-side `ilike` filter on `full_name`, `mobile_number`, `email`.

```javascript
.or(`full_name.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
```

**Filters:** Dropdown filters for `registration_status` and `age_group`. Filters stack with search (both applied simultaneously).

### 8.4. Athlete Profile Drill-Down (`/admin/athletes/:id`)

When admin clicks [View Profile], navigate to a read-only profile page showing:

**Section 1 — Personal Details**
All fields from Step 1 of the registration form in a clean key-value card layout.

**Section 2 — Guardian Details**
All fields from Step 2.

**Section 3 — Address**
All fields from Step 3.

**Section 4 — Club & Competition**
Fields from Steps 4 & 5.

**Section 5 — Documents**

Display a document card for each uploaded file in `athlete_documents`:

| Element                  | Detail                                        |
| ------------------------ | --------------------------------------------- |
| Document Type label      | e.g., "Passport Photo", "Aadhaar Card"        |
| Thumbnail                | Image preview (if image) or PDF icon (if PDF) |
| File name & upload date  | Metadata                                      |
| "View / Download" button | Opens signed URL in new tab                   |
| Status badge             | Pending / Approved / Rejected                 |

**Section 6 — Insurance Details** (if exists in `athlete_insurance`)

**Navigation:** A "← Back to Dashboard" breadcrumb at the top.

---

## 9. Feature 5 — Export to Excel / CSV

### 9.1. Export Scope

When admin clicks **"Export to Excel"** on the dashboard:

- Export **all athletes** currently matching the active search/filter combination (not just the current page)
- Fetch all matching rows from Supabase (remove pagination limit)
- Generate and download a `.xlsx` file using SheetJS

### 9.2. Excel Column Mapping

| Excel Column Header  | Source Field                                       |
| -------------------- | -------------------------------------------------- |
| Registration ID      | `athletes.id`                                      |
| Full Name            | `athletes.full_name`                               |
| Date of Birth        | `athletes.date_of_birth`                           |
| Age                  | `athletes.age`                                     |
| Gender               | `athletes.gender`                                  |
| Blood Group          | `athletes.blood_group`                             |
| Mobile Number        | `athletes.mobile_number`                           |
| Email                | `athletes.email`                                   |
| Father's Name        | `athletes.father_name`                             |
| Mother's Name        | `athletes.mother_name`                             |
| Guardian Name        | `athletes.guardian_name`                           |
| Guardian Mobile      | `athletes.guardian_mobile`                         |
| Current Address      | `athletes.current_address`                         |
| City                 | `athletes.city`                                    |
| State                | `athletes.state`                                   |
| PIN Code             | `athletes.pin_code`                                |
| Country              | `athletes.country`                                 |
| Club Name            | `athletes.club_name`                               |
| State Representation | `athletes.state_representation`                    |
| District             | `athletes.district`                                |
| Age Group            | `athletes.age_group`                               |
| Skill Level          | `athletes.skill_level`                             |
| Events Applied       | `athletes.events_applied` (joined by ", ")         |
| Registration Status  | `athletes.registration_status`                     |
| Registered On        | `athletes.created_at` (formatted DD/MM/YYYY HH:MM) |

### 9.3. SheetJS Implementation

```javascript
import * as XLSX from "xlsx";

const exportToExcel = (athletes) => {
  const rows = athletes.map((a) => ({
    "Registration ID": a.id,
    "Full Name": a.full_name,
    "Date of Birth": a.date_of_birth,
    Age: a.age,
    Gender: a.gender,
    "Blood Group": a.blood_group,
    Mobile: a.mobile_number,
    Email: a.email,
    "Father Name": a.father_name || "",
    "Mother Name": a.mother_name || "",
    "Guardian Name": a.guardian_name || "",
    "Guardian Mobile": a.guardian_mobile || "",
    Address: a.current_address,
    City: a.city,
    State: a.state,
    "PIN Code": a.pin_code,
    Country: a.country,
    Club: a.club_name || "",
    "State Rep": a.state_representation || "",
    District: a.district || "",
    "Age Group": a.age_group || "",
    "Skill Level": a.skill_level || "",
    "Events Applied": (a.events_applied || []).join(", "),
    Status: a.registration_status,
    "Registered On": new Date(a.created_at).toLocaleString("en-IN"),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Athletes");

  // Auto-width columns
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 15),
  }));
  worksheet["!cols"] = colWidths;

  const fileName = `Athletes_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
```

The button must show a loading spinner while fetching data and disable during the operation to prevent double-clicks.

---

## 10. API / Supabase RPC Reference

All data interactions use the Supabase JS client. No custom backend server is needed in Phase 1.

| Operation                    | Method                                                                | Table / Storage   |
| ---------------------------- | --------------------------------------------------------------------- | ----------------- |
| Submit athlete registration  | `supabase.from('athletes').insert(...)`                               | athletes          |
| Check duplicate mobile/email | `supabase.from('athletes').select('id').eq('mobile_number', val)`     | athletes          |
| Upload document              | `supabase.storage.from(bucket).upload(...)`                           | Storage           |
| Save document metadata       | `supabase.from('athlete_documents').insert(...)`                      | athlete_documents |
| Save insurance details       | `supabase.from('athlete_insurance').insert(...)`                      | athlete_insurance |
| Admin login                  | `supabase.auth.signInWithPassword({...})`                             | Auth              |
| Admin logout                 | `supabase.auth.signOut()`                                             | Auth              |
| Fetch athletes (paginated)   | `supabase.from('athletes').select('*').range(...)`                    | athletes          |
| Fetch single athlete         | `supabase.from('athletes').select('*').eq('id', id).single()`         | athletes          |
| Fetch athlete documents      | `supabase.from('athlete_documents').select('*').eq('athlete_id', id)` | athlete_documents |
| Fetch all for export         | `supabase.from('athletes').select('*').order('created_at')`           | athletes          |
| Get signed URL               | `supabase.storage.from(bucket).createSignedUrl(path, expiry)`         | Storage           |

---

## 11. Validation Rules Master List

| Field                  | Rule                                                       | Error Message                                                       |
| ---------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Full Name              | Required; min 3 chars; regex `/^[a-zA-Z\s]+$/`             | "Full name must contain only letters and spaces (min 3 characters)" |
| Date of Birth          | Required; must be between today-80yrs and today-5yrs       | "Please enter a valid date of birth"                                |
| Gender                 | Required; must be one of enum values                       | "Please select a gender"                                            |
| Blood Group            | Required                                                   | "Please select a blood group"                                       |
| Mobile Number          | Required; regex `/^[6-9]\d{9}$/` (Indian mobile)           | "Enter a valid 10-digit Indian mobile number"                       |
| Email                  | Required; regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`             | "Enter a valid email address"                                       |
| Mobile (duplicate)     | Async check — must not exist in DB                         | "This mobile number is already registered"                          |
| Email (duplicate)      | Async check — must not exist in DB                         | "This email address is already registered"                          |
| Guardian Mobile        | Required if age < 18; same format as mobile                | "Enter a valid 10-digit guardian mobile number"                     |
| PIN Code               | Required; regex `/^\d{6}$/`                                | "Enter a valid 6-digit PIN code"                                    |
| Image upload           | Max 1 MB post-compression; JPG/PNG only                    | "Image must be JPG or PNG and under 1 MB"                           |
| PDF upload             | Max 2 MB; application/pdf only                             | "Only PDF files under 2 MB are accepted"                            |
| Insurance expiry       | Required if insurance section visible; must be future date | "Insurance policy must not be expired"                              |
| Policy Number          | Required if insurance section visible; min 4 chars         | "Enter a valid policy number"                                       |
| Events (Step 5)        | At least 1 event must be selected                          | "Please select at least one event"                                  |
| Declaration checkboxes | Both must be checked                                       | "You must confirm and agree before submitting"                      |
| Guardian consent       | Required checkbox if age < 18                              | "Parent/guardian consent is required for athletes under 18"         |
| Admin email            | Required; valid email format                               | "Enter a valid email address"                                       |
| Admin password         | Required; min 6 chars                                      | "Password must be at least 6 characters"                            |

---

## 12. UI/UX & Design System

### 12.1. Color Palette (Tailwind Classes)

| Token   | Tailwind Class                    | Usage                             |
| ------- | --------------------------------- | --------------------------------- |
| Primary | `bg-blue-600` / `text-blue-600`   | Primary buttons, active step      |
| Success | `bg-green-500` / `text-green-600` | Approved badges, success toasts   |
| Warning | `bg-amber-400` / `text-amber-700` | Pending badges, insurance warning |
| Danger  | `bg-red-500` / `text-red-600`     | Error messages, Rejected badges   |
| Neutral | `bg-gray-100` / `text-gray-700`   | Card backgrounds, secondary text  |
| Surface | `bg-white`                        | Form cards, table                 |
| Border  | `border-gray-200`                 | Input borders, dividers           |

### 12.2. Typography

- Font: Inter (Google Fonts — free)
- Headings: `font-semibold text-gray-900`
- Body: `text-sm text-gray-700`
- Labels: `text-xs font-medium text-gray-500 uppercase tracking-wide`
- Error text: `text-xs text-red-600 mt-1`

### 12.3. Component Library (to be built with Google Stitch)

| Component         | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| `<StepIndicator>` | Top progress bar showing 8 steps with active/completed/upcoming states |
| `<FormField>`     | Label + input + error message wrapper                                  |
| `<UploadZone>`    | Drag-and-drop + click-to-browse with preview + remove                  |
| `<StatusBadge>`   | Colored pill badge for registration statuses                           |
| `<DataTable>`     | Sortable, filterable, paginated grid                                   |
| `<SummaryCard>`   | Metric card for the dashboard header                                   |
| `<Toast>`         | Slide-in notification (success/error/info)                             |
| `<Modal>`         | Generic modal for Terms & Conditions                                   |
| `<ConfirmStep>`   | Step 7 read-only summary of submitted data                             |

### 12.4. Responsive Design

- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- The registration form must be **fully usable on a 375px wide mobile screen**
- Upload zones must support tapping on mobile (in addition to drag-and-drop on desktop)
- Admin dashboard grid collapses to a card-stack layout on screens below `md`
- All font sizes must meet WCAG AA contrast ratios

---

## 13. Security Requirements

| Requirement             | Implementation                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Admin routes protected  | `<ProtectedRoute>` checks `supabase.auth.getSession()`                               |
| RLS on all DB tables    | Configured in Section 4.3                                                            |
| Supabase keys           | Only `SUPABASE_URL` and `SUPABASE_ANON_KEY` in frontend; anon key is safe due to RLS |
| Storage buckets private | No public bucket access; all document access via signed URLs                         |
| Signed URL expiry       | 1 year for document URLs (admin use); revisit in Phase 2                             |
| No admin self-signup    | Admin accounts created only via Supabase dashboard                                   |
| Duplicate prevention    | Mobile & Email checked on blur and on submit                                         |
| Input sanitization      | Zod schema strips unknown fields and validates types                                 |
| Environment variables   | All Supabase credentials stored in `.env` — never committed to Git                   |

---

## 14. Folder Structure

```
sports-club-app/
├── public/
│   └── logo.svg
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── common/
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── Modal.jsx
│   │   ├── registration/
│   │   │   ├── Step1Personal.jsx
│   │   │   ├── Step2Guardian.jsx
│   │   │   ├── Step3Address.jsx
│   │   │   ├── Step4Club.jsx
│   │   │   ├── Step5Competition.jsx
│   │   │   ├── Step6Documents.jsx
│   │   │   ├── Step7Declaration.jsx
│   │   │   └── Step8Payment.jsx
│   │   └── admin/
│   │       ├── SummaryCard.jsx
│   │       ├── DataTable.jsx
│   │       └── AthleteProfileView.jsx
│   ├── hooks/
│   │   ├── useFormPersistence.js
│   │   ├── useDuplicateCheck.js
│   │   └── useAdmin.js
│   ├── lib/
│   │   ├── supabaseClient.js      // Supabase init
│   │   ├── imageCompression.js    // Compression util
│   │   ├── uploadDocument.js      // Storage upload helper
│   │   └── exportExcel.js         // SheetJS export util
│   ├── pages/
│   │   ├── RegistrationPage.jsx
│   │   ├── SuccessPage.jsx
│   │   ├── admin/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── AthleteDetailPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── routes/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx
│   ├── schemas/
│   │   ├── step1Schema.js         // Zod schemas per step
│   │   ├── step2Schema.js
│   │   └── ...
│   ├── store/
│   │   └── registrationStore.js   // Optional: Zustand if global state needed
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                  // Tailwind directives
├── .env                           // VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 15. Acceptance Criteria & QA Checklist

### Registration Form

- [ ] All 8 steps render and are navigable forward/backward
- [ ] Progress bar accurately reflects current step
- [ ] Form data persists in localStorage on step change
- [ ] localStorage is cleared after successful submission
- [ ] Age is auto-calculated and updates live when DOB changes
- [ ] Mobile number field rejects non-numeric and <10 digit inputs
- [ ] Email field rejects invalid format
- [ ] Duplicate mobile/email shows inline error on blur
- [ ] Guardian fields become mandatory when age < 18
- [ ] Minor warning banner displays correctly
- [ ] Age group is auto-suggested based on DOB
- [ ] Insurance section appears only when event requires it
- [ ] Insurance expiry date rejects past dates
- [ ] Image files are compressed and toast is shown
- [ ] Image files exceeding 1 MB post-compression are rejected
- [ ] PDF files exceeding 2 MB are rejected
- [ ] Non-PDF files rejected in PDF-only fields
- [ ] All mandatory uploads block form progression if missing
- [ ] Document thumbnails and "Remove" button function correctly
- [ ] Declaration checkboxes both required before submission
- [ ] Guardian consent checkbox appears for minors
- [ ] Submission inserts correct row in `athletes` table
- [ ] Submission inserts rows in `athlete_documents` for each upload
- [ ] Submission inserts row in `athlete_insurance` if applicable
- [ ] Success screen displays with shortened registration ID
- [ ] Payment step shows placeholder UI with disabled button

### Admin Panel

- [ ] Login page is accessible at `/admin/login`
- [ ] Valid admin credentials log in successfully
- [ ] Invalid credentials show error message
- [ ] Non-admin Supabase users are blocked even with valid credentials
- [ ] All `/admin/*` routes redirect to login if no session exists
- [ ] Logout button clears session and redirects to login
- [ ] Dashboard summary cards show correct counts
- [ ] Data grid displays all registered athletes (paginated, 20 per page)
- [ ] All columns render correct data
- [ ] Status badges display correct colors
- [ ] Search filters grid in real time by name/mobile/email
- [ ] Status dropdown filter works independently and combined with search
- [ ] Age group filter works
- [ ] Grid is sortable by Name, Date, Status, Age Group
- [ ] [View Profile] navigates to athlete detail page
- [ ] Profile page displays all registration data sections
- [ ] Document cards show file name, upload date, and status badge
- [ ] "View / Download" opens signed document URL in new tab
- [ ] "← Back" breadcrumb navigates to dashboard

### Excel Export

- [ ] "Export to Excel" button is prominently visible on dashboard
- [ ] Button shows loading spinner during data fetch
- [ ] Downloaded file has correct `.xlsx` extension
- [ ] Filename includes current date (e.g., `Athletes_Export_2026-04-22.xlsx`)
- [ ] All column headers match specification
- [ ] All rows of matching athletes are included (not just current page)
- [ ] Active search/filter criteria are respected in the export
- [ ] Array fields (events_applied) are comma-joined as plain text
- [ ] Dates are formatted correctly (DD/MM/YYYY)

---

## 16. Milestones & Delivery Timeline

| Milestone                          | Deliverable                                                                          | Target            |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ----------------- |
| M1 — Foundation                    | Supabase project setup, DB schema, RLS, Storage buckets, Supabase Auth admin user    | Week 1            |
| M2 — Registration Form (Steps 1–4) | Personal, Guardian, Address, Club steps with validation and localStorage persistence | Week 1–2          |
| M3 — Registration Form (Steps 5–8) | Competition, Documents (with compression & upload), Declaration, Payment placeholder | Week 2–3          |
| M4 — Full Submission Pipeline      | End-to-end: form → Supabase DB + Storage → success screen                            | Week 3            |
| M5 — Admin Login & Dashboard       | Login page, protected routes, data grid with search/filter/sort/pagination           | Week 3–4          |
| M6 — Profile Drill-Down            | Athlete profile page with all sections + document viewer                             | Week 4            |
| M7 — Excel Export                  | Export to .xlsx with all columns, respecting active filters                          | Week 4            |
| M8 — QA & Bug Fix                  | Full checklist run, cross-browser testing, mobile responsiveness                     | Week 5            |
| **Phase 1 Complete**               | All acceptance criteria passed                                                       | **End of Week 5** |

---

## 17. Open Questions & Assumptions

| #   | Question / Assumption                                                                                                                                                 | Decision Needed By |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| 1   | **Events List:** What are the exact sport events to be listed in Step 5? For Phase 1, a hardcoded list of 5–10 events will be used as a placeholder.                  | Before M3          |
| 2   | **Insurance Trigger:** Which events require insurance? For Phase 1, at least one hardcoded event will have `isInsuranceRequired: true`.                               | Before M3          |
| 3   | **Registration Fee Amount:** Is ₹500 the correct placeholder amount to show on the payment step?                                                                      | Before M3          |
| 4   | **SuperClub Logo / Branding:** Please provide the SuperClub logo (PNG/SVG) and primary brand color hex code for use in the UI.                                        | Before M2          |
| 5   | **Admin Password:** After the Supabase admin user is created, the initial password will be shared securely. Who should receive it?                                    | Before M5          |
| 6   | **Age Group Override:** Should athletes be allowed to override the auto-suggested age group, or is it locked? Current assumption: they can override.                  | Before M3          |
| 7   | **State Field:** PIN-to-state auto-detection is deferred to Phase 2. Manual text entry is used in Phase 1. Confirmed?                                                 | Before M2          |
| 8   | **Partial Save (Draft):** Should athletes be able to exit mid-form and return to continue via a link/ID? Current assumption: localStorage only (same device/browser). | Before M2          |
| 9   | **Document Re-upload:** Can athletes re-upload a document after submission? This is out of Phase 1 scope; admin contacts them manually.                               | Before launch      |
| 10  | **Supabase Region:** Which Supabase data region should the project be created in? Recommended: `ap-south-1` (Mumbai) for Indian users.                                | Before M1          |

---

_This document is the single source of truth for Phase 1 development. Any change to scope, schema, or validations must be updated here and communicated to all stakeholders before implementation._

---

**Document Owner:** Project Lead  
**Next Review:** Before Phase 2 kickoff  
**Phase 2 Preview:** Payment Gateway (Razorpay/UPI), Email Notifications (OTP, Confirmation), Coach Registration, Admin Document Approval Workflow
