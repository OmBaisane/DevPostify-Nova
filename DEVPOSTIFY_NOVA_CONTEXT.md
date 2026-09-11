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

- Landing page

## Authentication

- Register
- Login
- Logout
- JWT authentication
- Protected routes

## Posts

- Feed
- Create post
- View post details
- Edit own post
- Delete own post
- Markdown support
- Code highlighting
- Categories

## Profile

- View profile
- Edit profile
- My posts

## Discovery

- Search
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

- Responsive design
- Loading/skeleton states
- Empty states
- Error states
- Form validation
- Accessible interactions

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

- The provided DevPostify logo reference is the branding source.
- Scalable vector SVG assets.
- Favicon: Symbol-only logo mark.

---

# 6. TECH STACK

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React

## Backend

- Node.js
- Express
- TypeScript
- JWT
- Mongoose

## Database

- MongoDB Atlas

## Media

- Cloudinary

## Deployment

- Frontend: Vercel
- Backend: Render

---

# 7. ARCHITECTURE

One GitHub repository:

```text
DevPostify-Nova/
├── frontend/
├── backend/
├── README.md
├── .gitignore
└── DEVPOSTIFY_NOVA_CONTEXT.md
Frontend and backend are separate applications.
The frontend must NEVER connect directly to MongoDB.

8. DATABASE (V1)
Collections:

users

posts

bookmarks

Database principles:

Sensible validation

Compound unique indexes for deduplication

Timestamps and relations

Query indexes and full-text search indexing

9. REST API SPECIFICATION & CONVENTIONS
Auth Middleware: requireAuth (backend/src/middleware/auth.ts)

Request Typing: req.userId attached to Express Request

Models: Named exports (UserModel, PostModel, BookmarkModel)

Response Helpers: sendSuccess (backend/src/utils/apiResponse.ts)

Endpoints:

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

GET /api/search

10. COMPLETED MILESTONES (1–15)
Milestone 1 — Project Setup (COMPLETE)
DevPostify Nova repository initialized. Frontend & Backend setups verified.

Milestone 2 — Design System Foundation (COMPLETE)
Design tokens, dark-first theme direction, and typography setup.

Milestone 3 — Backend Foundation (COMPLETE)
Express + TypeScript structure, MongoDB connection, central error handling, environment setup.

Milestone 4 — Database / Mongoose Foundation (COMPLETE)
User, Post, and Bookmark schemas initialized. Corrected auther typo to author.

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
Mounted /api/search with keyword regex matching, idempotent bookmark toggling, /bookmarks page, and Suspense-wrapped /search discovery page.

Milestone 15 — Post Actions & Settings (COMPLETE)
Implemented /posts/[id]/edit workflow with author verification and PATCH /api/posts/:id integration.

Built protected /settings view with registered credentials summary and authenticated session termination.

Locked UI permanently to Developer Dark Mode to guarantee consistent typography contrast and zero visual regressions.

Added Settings shortcut to global Navbar.

### Milestone 16 — Full Integration & End-to-End Testing (COMPLETE)

- Added global fallback error boundaries: developer-first 404 Terminal card (`app/not-found.tsx`) and client hydration failure handler (`app/error.tsx`).

- Configured SVG brand icon metadata in `app/layout.tsx` to cleanly resolve browser `/favicon.ico` 404 requests.

- Validated complete user journeys across all authenticated and unauthenticated flows (Register -> Post Creation -> Reading -> Editing -> Bookmarking -> Search -> Profile updates -> Settings session termination).

- Verified route protection redirects: unauthenticated direct hits on `/create`, `/bookmarks`, and `/settings` bounce cleanly to `/login`.

- Confirmed zero functional regressions across Express controllers and Next.js App Router client components.

### Milestone 17 — Performance & Product Polish (COMPLETE)

- Built a custom, zero-dependency `ToastProvider` with micro-animations for developer actions.

- Wired real-time toast feedback to all core actions: Post Creation, Post Editing, Post Deletion, Bookmark toggling, and Profile updates.

- Hardened application metadata: configured dynamic title templates, OpenGraph tags for social sharing, and resolved favicon asset linking.

- Conducted full production build audit: verified zero TypeScript errors and zero prerender warnings across both backend and frontend applications.

11. CURRENT POSITION

### Current State

Milestones 1–17 are COMPLETE, VERIFIED, and LOCKED.

### Next Milestone

**Milestone 18 — Production Deployment (Vercel + Render)**

Expected Scope:

- Backend deployment on Render (environment variables, MongoDB Atlas network binding, CORS configuration).

- Frontend deployment on Vercel (Next.js build settings, production environment variables).

- Live domain testing and full end-to-end cloud verification.

12. REMAINING ROADMAP (V1)

Milestone 18: Production Deployment (Vercel + Render)

Milestone 19: README & Portfolio Polish
```
