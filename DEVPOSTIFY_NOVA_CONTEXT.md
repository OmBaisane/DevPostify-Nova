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

- Dark mode by default
- Light mode
- Account settings

## UX

- Responsive design
- Loading/skeleton states
- Empty states
- Error states
- Form validation
- Toast/success feedback
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

Primary: #2563EB
Accent: #7C3AED
Gradient: Blue → Violet

## Theme

- Dark mode is the default.
- Light mode is supported.

## Typography

- Poppins — headings
- Inter — body
- JetBrains Mono — code

## Spacing

8px spacing system.

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

Model Models: Named exports (UserModel, PostModel, BookmarkModel)

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

10. COMPLETED MILESTONES (1–10)
Milestone 1 — Project Setup (COMPLETE)
DevPostify Nova repository initialized.

Frontend & Backend setups verified.

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
Public profile lookup by username with posts (GET /api/profile/:username).

Edit own profile (PATCH /api/profile) with validation. Username and email modification locked.

Milestone 8 — Bookmarks System (COMPLETE)
POST /api/bookmarks/:postId — Add bookmark with duplicate protection via compound unique index { user: 1, post: 1 }.

DELETE /api/bookmarks/:postId — Remove bookmark.

GET /api/bookmarks — List user's bookmarks populated with post and author data.

Milestone 9 — Discovery: Search & Filtering (COMPLETE)
MongoDB full-text search index (title: 10, tags: 5, content: 1).

GET /api/posts integrated with relevance sorting ($meta: "textScore"), category filters, and pagination.

Post feed route wired correctly in router.

Milestone 10 — Frontend Foundation & Design System Setup (COMPLETE)
Next.js App Router initialized with Google Fonts (Poppins, Inter, JetBrains Mono).

Dark mode default with brand colors (#2563EB, #7C3AED) and locked radiuses (16px cards, 12px buttons/inputs).

Credentials-enabled type-safe API client (frontend/src/lib/api.ts).

Production build verified.

### Milestone 11 — Frontend Authentication (COMPLETE)
- Configured centralized `AuthContext` with session hydration via `/api/auth/me`

- Implemented `login`, `register`, and `logout` operations with auto-redirection

- Built responsive `/login` and `/register` pages with form validation, error states, and locked design tokens (16px cards, 12px inputs/buttons)

- Built `ProtectedRoute` client component for guarding authenticated routes

- Production build verified with zero errors

### Milestone 12 — Feed & Post UI (COMPLETE)

- Implemented global responsive `Navbar` with brand logo and dynamic auth actions (Sign In / Register vs Write Post / Bookmarks / User Badge / Logout).

- Built `PostCard` component with reading-time calculation, category tags, author metadata, and hover interactions.

- Built `PostSkeleton` shimmer loader and `EmptyState` view for zero-state handling.

- Built feed page (`/`) integrated with `GET /api/posts` supporting real-time category filtering.

- Implemented `/create` page wrapped in `ProtectedRoute` with title, category selector, comma-separated tags, and a live Write/Preview markdown editor.

- Implemented `/posts/[id]` dynamic post detail view with author headers, read time, formatted body, and author-only post deletion (`DELETE /api/posts/:id`).

- Verified full roundtrip: create post -> feed rendering -> view post -> delete post.

### Current State

Milestones 1–12 are COMPLETE, VERIFIED, and LOCKED.

### Next Milestone

**Milestone 13 — Profile UI**

Expected Scope:

- Public profile page (`/profile/[username]`) fetching user details (`GET /api/profile/:username`)

- Display author bio, join date, avatar initial, and tabbed list of posts created by this user

- Edit Profile modal or settings page (`PATCH /api/profile`) for updating name and bio

- Form validation and ownership protection

12. REMAINING ROADMAP (V1)

Milestone 13: Profile UI (Public Profile & Edit Profile)

Milestone 14: Search & Bookmarks UI

Milestone 15: Settings & Theme Controls

Milestone 16: Full Integration & End-to-End Testing

Milestone 17: Performance & Product Polish

Milestone 18: Production Deployment (Vercel + Render)

Milestone 19: README & Portfolio Polish
```
