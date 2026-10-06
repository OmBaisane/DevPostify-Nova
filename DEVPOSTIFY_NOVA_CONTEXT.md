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
- Do not over-engineer V1 / V1.1.
- Do not add features outside the locked scope.
- Prefer practical production-ready solutions.
- Keep code clean, maintainable, reusable, and understandable.
- Verify important work before moving forward.
- Ask only when a genuinely important product/architecture decision cannot reasonably be determined.
- Implementation takes priority over excessive theory.

Development workflow:
PLAN → EXECUTE → VERIFY → TEST → COMMIT → NEXT

---

# 3. CORE V1 & V1.1 FEATURES

## Authentication

- Register (synced 8+ char password & alphanumeric username constraints)
- Login (email or username)
- Logout
- Stateless JWT authentication via cross-domain HTTP-Only cookies
- Protected routes

## Developer Profiles & Identity (V1.1 Enhanced)

- View profile by username
- Edit profile: Name, Bio, Skills (chips), Specialties, and Social links (GitHub, LinkedIn, Website)
- Direct signed avatar uploads via Cloudinary Edge
- Author's published posts listing

## Technical Publishing (V1.1 Enhanced)

- Create, view, edit, and delete own posts
- Tabbed Markdown write/preview editor (`react-markdown` + `remark-gfm` + `prismjs`)
- 5 locked engineering categories: `webdev`, `architecture`, `devops`, `opensource`, `ai`
- Direct signed cover image uploads via Cloudinary Edge
- Private draft support (`isDraft` toggle)

## Engagement & Discussion (V1.1 New)

- Idempotent post reaction toggle ("Insightful / Liked") with atomic `$inc: 1` / `$inc: -1` counters
- Flat single-level technical discussion system under posts
- Author-only comment deletion with atomic counter updates
- Optimistic UI on reactions and comments

## Notifications (V1.1 New)

- Persisted alert storage for post reactions and comments (self-actions excluded)
- Navbar bell icon with real-time unread badge count
- Dedicated `/notifications` activity feed with deep-links and bulk "mark as read"

## Discovery & Bookmarks (V1.1 Enhanced)

- Feed sorting toggle: Latest vs. Top Insights (sorted by reactions)
- Clickable `#tag` filter chips
- Full-text search with ReDoS/length sanitization (`escapeRegex` + 100-character cap)
- Bookmark saving, removing, and dedicated `/bookmarks` view

## Settings & UX

- Developer dark mode locked default
- Account credentials overview and session termination
- Responsive design with off-canvas mobile navigation drawer
- Loading/skeleton states, empty states, and custom zero-dependency toast system

---

# 4. EXPLICITLY OUT OF SCOPE

Do NOT build:

- Realtime WebSockets / Socket.IO
- Chat / DMs
- AI integrations
- Communities / Teams
- Full GitHub synchronization / OAuth
- Nested comment trees (flat discussions only)
- Voice / Video

---

# 5. DESIGN SYSTEM

- **Colors**: Primary `#2563EB`, Accent `#7C3AED`, Gradient `Blue → Violet`, Background `#020617` (Slate-950)
- **Typography**: Poppins (headings), Inter (body), JetBrains Mono (code)
- **Spacing**: 8px system
- **Radius**: Cards 16px, Buttons 12px, Inputs 12px

---

# 6. TECH STACK

- **Frontend**: Next.js App Router (15+), React 19, TypeScript (Strict), Tailwind CSS, Lucide React, `react-markdown`, `remark-gfm`, `prismjs`
- **Backend**: Node.js, Express, TypeScript, JWT (`jsonwebtoken`), Cookie-Parser, Mongoose ODM, Zod, Cloudinary SDK
- **Database**: MongoDB Atlas
- **Deployments**: Vercel (Frontend), Render (Backend API)

---

# 7. ARCHITECTURE & DATABASE COLLECTIONS

- `users`: Credentials, bio, avatar, skills, specialties, socials
- `posts`: Content, category, tags, coverImage, isDraft, reactionsCount, commentsCount, author
- `bookmarks`: User and post references (unique compound index)
- `reactions`: User and post references (unique compound index for idempotency)
- `comments`: Post, author, content (indexed `{ post: 1, createdAt: -1 }`)
- `notifications`: Recipient, sender, type (`reaction` | `comment`), post, isRead

---

# 8. REST API SPECIFICATION

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- **Posts**: `GET /api/posts` (`?sort=`, `?category=`, `?tag=`), `GET /api/posts/:id`, `POST /api/posts`, `PATCH /api/posts/:id`, `DELETE /api/posts/:id`
- **Reactions**: `POST /api/posts/:id/react`, `GET /api/posts/:id/react`
- **Comments**: `GET /api/posts/:id/comments`, `POST /api/posts/:id/comments`, `DELETE /api/comments/:commentId`
- **Profile**: `GET /api/profile/:username`, `PATCH /api/profile`
- **Notifications**: `GET /api/notifications`, `GET /api/notifications/unread-count`, `PATCH /api/notifications/read-all`, `PATCH /api/notifications/:id/read`
- **Upload**: `POST /api/upload/signature`
- **Bookmarks**: `GET /api/bookmarks`, `POST /api/bookmarks/:postId`, `DELETE /api/bookmarks/:postId`
- **System**: `GET /api/search`, `GET /api/health`

---

# 9. COMPLETED MILESTONES (1–26)

- **Milestones 1–19**: Core V1 platform complete, hardened, and frozen.
- **Milestone 20 — Database Schemas & V1.1 Models Setup (COMPLETE)**: Extended User and Post models; created Reaction, Comment, and Notification models with compound unique indexing.
- **Milestone 21 — Media Upload Pipeline (COMPLETE)**: Cloudinary signed direct upload endpoint and frontend upload utility.
- **Milestone 22 — Enhanced Developer Identity (COMPLETE)**: Avatar upload, tech stack skills, specialties, socials, and profile overhaul with custom SVG social icons.
- **Milestone 23 — Post Reactions Engine (COMPLETE)**: Idempotent toggle reactions, atomic counters, and optimistic UI button.
- **Milestone 24 — Technical Discussion System (COMPLETE)**: Flat comments API, post author notification trigger, and optimistic comment section with author deletion.
- **Milestone 25 — Enhanced Discovery & Drafting (COMPLETE)**: Feed sort bar (Latest vs Top Insights), tag filtering, cover image rendering, and draft persistence.
- **Milestone 26 — Notification Center (COMPLETE)**: Persisted alert pipeline, Navbar bell badge with unread count polling, and `/notifications` activity feed.

---

# 10. CURRENT POSITION & NEXT STEPS

- **Current State**: Milestones 1–26 are 100% COMPLETE, VERIFIED, and PASSING BUILDS.
- **Remaining for V1.1 Completion**:
  - **Milestone 27**: Full Integration, Edit Post Cover/Draft sync, Mobile Drawer audit, and V1.1 Production Release.
