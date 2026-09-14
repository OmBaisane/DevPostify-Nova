# DEVPOSTIFY NOVA — PROJECT CONTEXT

> This file is the source of truth for DevPostify Nova continuity across development sessions.
> Update it only at meaningful milestones.
> Do not add unnecessary temporary debugging details.

---

# 1. PROJECT IDENTITY

## Public Name

DevPostify

## Development Name

DevPostify Nova

## Tagline

Where Developers Build Their Identity.

## Project Type

Developer-first professional social platform.

## Product Vision

DevPostify is a modern professional platform for developers to:

- Share technical knowledge
- Showcase projects and expertise
- Build a professional developer identity
- Discover useful technical content
- Save valuable posts

The product should feel:

- Modern
- Premium
- Professional
- Developer-first
- SaaS-like

It must NOT feel like a generic social-media clone.

---

# 2. DEVELOPMENT PRINCIPLES

- Build from scratch.
- Old DevPostify is optional reference only.
- New project must never depend on the old project.
- Quality and speed are equally important.
- Build step-by-step through meaningful milestones.
- Do not over-engineer V1.
- Do not add features outside the locked V1 scope.
- Prefer practical production-ready solutions.
- Keep code clean, maintainable, reusable, and understandable.
- Verify important work before moving forward.
- Ask only when a genuinely important product/architecture decision cannot reasonably be determined.
- Implementation takes priority over excessive theory.

Development workflow:
PLAN → EXECUTE → VERIFY → TEST → COMMIT → NEXT

---

# 3. LOCKED V1 FEATURES

## Landing

- Landing page / Community feed

## Authentication

- Register (synced 8+ char password & alphanumeric username constraints)
- Login (email or username)
- Logout
- Stateless JWT authentication via cross-domain HTTP-Only cookies
- Protected routes

## Posts

- Feed with category pills
- Create post with tabbed Markdown write/preview
- View post details with AST syntax-highlighted code blocks & clipboard copy
- Edit own post
- Delete own post
- Markdown support (`react-markdown` + `remark-gfm`)
- Categories

## Profile

- View profile by username
- Edit profile (Name & Bio)
- Author's published posts listing

## Discovery

- Full-text search with ReDoS/length sanitization
- Category filtering

## Bookmarks

- Bookmark post
- Remove bookmark
- View bookmarks

## Settings

- Developer dark mode locked default
- Account credentials overview
- Session termination

## UX

- Responsive design with off-canvas mobile drawer
- Loading/skeleton states
- Empty states
- Error states
- Form validation (1:1 Frontend vs Backend synchronization)
- Accessible interactions & HTML5 semantic landmarks

---

# 4. EXPLICITLY OUTSIDE V1

Do NOT build these features in V1:

- Chat
- AI
- Communities
- GitHub Sync
- Notifications
- Voice
- Video
- Realtime features

Do not silently expand the V1 scope.

---

# 5. DESIGN SYSTEM

## Colors

- Primary: #2563EB
- Accent: #7C3AED
- Gradient: Blue → Violet
- Background: #020617 (Slate-950)

## Theme

- Developer Dark Mode is the locked default.

## Typography

- Poppins — headings
- Inter — body
- JetBrains Mono — code

## Spacing

- 8px spacing system.

## Radius

- Cards: 16px
- Buttons: 12px
- Inputs: 12px

## Branding

- Scalable vector SVG assets (`/brand/devpostify-mark.svg`).
- Favicon: Symbol-only logo mark.

---

# 6. TECH STACK

## Frontend

- Next.js App Router (15+)
- React 19
- TypeScript (Strict)
- Tailwind CSS
- Lucide React
- `react-markdown` & `remark-gfm`

## Backend

- Node.js
- Express
- TypeScript
- JWT (`jsonwebtoken`)
- Cookie-Parser
- Mongoose ODM
- Zod

## Database

- MongoDB Atlas

## Deployment

- Frontend: Vercel Edge CDN (`dev-postify-nova.vercel.app`)
- Backend: Render Web Service (`devpostify-nova-api.onrender.com`)

---

# 7. ARCHITECTURE

```text
DevPostify-Nova/
├── frontend/
├── backend/
├── README.md
├── .gitignore
└── DEVPOSTIFY_NOVA_CONTEXT.md
Frontend and backend are decoupled applications.

Frontend communicates with backend strictly via REST API with credentials: "include".

Backend trusts reverse-proxy hops (trust proxy: 1) to correctly evaluate secure cookie contexts.

8. DATABASE (V1)
Collections
users

posts

bookmarks

Database principles
Sensible validation schemas.

Compound unique indexes for deduplication (e.g., user + post on bookmarks).

Timestamps and relations via ObjectId references.

Compound full-text search indexing on posts (title, content, tags).

9. REST API SPECIFICATION & CONVENTIONS
Auth Middleware: requireAuth (backend/src/middleware/auth.ts)

Request Typing: req.userId attached via Express namespace augmentation

Models: Named exports (UserModel, PostModel, BookmarkModel)

Response Helpers: sendSuccess (backend/src/utils/apiResponse.ts)

Endpoints
POST /api/auth/register

POST /api/auth/login

POST /api/auth/logout

GET /api/auth/me

GET /api/posts (Supports text search ?search=, category ?category=, pagination ?page=&limit=)

GET /api/posts/:id

POST /api/posts

PATCH /api/posts/:id

DELETE /api/posts/:id

GET /api/profile/:username

PATCH /api/profile

GET /api/bookmarks

POST /api/bookmarks/:postId

DELETE /api/bookmarks/:postId

GET /api/health

10. COMPLETED MILESTONES (1–19)
Milestone 1 — Project Setup (COMPLETE)
DevPostify Nova repository initialized. Frontend & Backend setups verified.

Milestone 2 — Design System Foundation (COMPLETE)
Design tokens, dark-first theme direction, and typography setup.

Milestone 3 — Backend Foundation (COMPLETE)
Express + TypeScript structure, MongoDB connection, central error handling, environment setup.

Milestone 4 — Database / Mongoose Foundation (COMPLETE)
User, Post, and Bookmark schemas initialized. Corrected author population.

Milestone 5 — Authentication System (COMPLETE)
Register, login, logout, HTTP-only JWT cookies, requireAuth middleware, GET /api/auth/me.

Milestone 6 — Posts System (COMPLETE)
Full CRUD for posts, ownership validation, author population, pagination.

Milestone 7 — Profile System (COMPLETE)
Public profile lookup by username with posts (GET /api/profile/:username). Edit own profile (PATCH /api/profile) with validation. Username and email modification locked.

Milestone 8 — Bookmarks System (COMPLETE)
POST /api/bookmarks/:postId with duplicate protection, DELETE /api/bookmarks/:postId, and GET /api/bookmarks.

Milestone 9 — Discovery: Search & Filtering (COMPLETE)
MongoDB full-text search index, category filters, and pagination.

Milestone 10 — Frontend Foundation & Design System Setup (COMPLETE)
Next.js App Router initialized with Google Fonts (Poppins, Inter, JetBrains Mono). Locked design tokens and credentials-enabled type-safe API client.

Milestone 11 — Frontend Authentication (COMPLETE)
Centralized AuthContext, session hydration, /login & /register views, and ProtectedRoute wrapper.

Milestone 12 — Feed & Post UI (COMPLETE)
Global responsive Navbar, PostCard with reading-time, shimmer skeletons, category filters, Markdown write/preview editor (/create), and dynamic post detail view (/posts/[id]).

Milestone 13 — Profile UI & Edit Profile (COMPLETE)
Dynamic route /profile/[username], developer hero card, post metrics, and EditProfileModal connected to PATCH /api/profile.

Milestone 14 — Bookmarks UI & Discovery Search (COMPLETE)
Idempotent bookmark toggling, /bookmarks page, and text-query discovery feed.

Milestone 15 — Post Actions & Settings (COMPLETE)
Implemented /posts/[id]/edit workflow with author verification and PATCH /api/posts/:id integration. Built protected /settings view with registered credentials summary and authenticated session termination.

Milestone 16 — Full Integration & End-to-End Testing (COMPLETE)
Added global fallback error boundaries: developer-first 404 Terminal card (app/not-found.tsx) and client hydration failure handler (app/error.tsx). Validated complete user journeys across all authenticated and unauthenticated flows.

Milestone 17 — Performance & Product Polish (COMPLETE)
Built a custom, zero-dependency ToastProvider with micro-animations for developer actions. Wired real-time toast feedback to all core actions. Full production build audit verified.

Milestone 18 — Production Deployment (Vercel + Render) (COMPLETE)
Deployed Express/Node.js backend API on Render (devpostify-nova-api.onrender.com). Connected to MongoDB Atlas with production network binding. Deployed Next.js App Router frontend on Vercel (dev-postify-nova.vercel.app).

Milestone 19 — Final Hardening, Accessibility, Security & Release Freeze (COMPLETE)
Mobile Responsive Drawer: Built a full off-canvas navigation drawer with backdrop blur, scroll locks, and escape-key handling.

Safe Markdown Rendering: Integrated unified AST markdown pipeline with GFM support, overflow-contained code blocks, and copy-to-clipboard actions across Detail, Create, and Edit views.

Semantic HTML & a11y Audit: Refactored layouts, feed, bookmarks, post cards, author profile, and settings into strict HTML5 semantic landmarks (<main>, <header>, <article>, <nav>, <section>, <dl>).

Security & Validation Hardening: Synchronized 8-character password constraint and alphanumeric username validation across client and server. Enforced explicit SameSite=None; Secure; path=/ cookies. Sanitized search inputs against ReDoS vectors.

Codebase Cleanup & Type Safety: Eliminated any types across controllers and API client using explicit query interfaces. Pruned dead theme contexts and temporary console logs. Sanitized /api/health probe against environment disclosure.

Portfolio-Grade Documentation: Standardized root README.md with deployment badges, architecture topology, and comprehensive local setup instructions.

11. CURRENT POSITION
Current State
All Milestones (1–19) are 100% COMPLETE, AUDITED, VERIFIED, and LIVE IN PRODUCTION.

Frontend App: https://dev-postify-nova.vercel.app

Backend API: https://devpostify-nova-api.onrender.com

Health Check: https://devpostify-nova-api.onrender.com/api/health

V1 Scope Status: FROZEN & SIGNED OFF

12. FUTURE ROADMAP (POST-V1 / V2 CANDIDATES)
The following features are strictly deferred to future iterations and are outside V1 scope:

Nested comment threads on engineering posts

Clap / Upvote technical reaction system

Author follow / following graph

In-app notification feed for author activity

Syntax-highlighted code snippet sharing playground

GitHub OAuth integration & repository cards
```
