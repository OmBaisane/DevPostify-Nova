# DEVPOSTIFY NOVA — PROJECT CONTEXT

> Source of truth for DevPostify Nova continuity. Keep this file current and concise.
> The actual repository is the source of truth for implementation status.
> Never mark work complete unless it was implemented and verification results are honestly recorded.
> Workflow: PLAN → EXECUTE → VERIFY → TEST → COMMIT → REPORT → STOP.

---

## 1. Project Identity

- **Public name:** DevPostify
- **Development name:** DevPostify Nova
- **Tagline:** Where Developers Build Their Identity.
- **Product:** Developer-first professional technical publishing and identity platform.
- **Vision:** Share technical knowledge, showcase expertise, build a professional developer identity, discover useful technical content, and save valuable posts.
- **Experience:** Modern, premium, professional, developer-first, SaaS-quality—not a generic social-media clone.
- Old DevPostify is reference-only and must never become a dependency.

---

## 2. Development Principles

- Keep V1/V1.1 scope locked; do not over-engineer.
- Prefer practical, maintainable, production-oriented solutions.
- Workflow: **PLAN → EXECUTE → VERIFY → TEST → COMMIT → REPORT → STOP**.
- Inspect actual code before assuming a task is missing or complete.
- Never claim a build, test, deployment, or command passed unless it actually did.
- After each milestone, update this file with completed work, actual verification, known issues, and next milestone.
- Gemini implements step-by-step; ChatGPT helps with architecture, review, audits, and final polish.
- The user explicitly starts the next milestone with: **“Done bhai ab next”**.
- Never automatically continue to another milestone.

---

## 3. Locked V1 / V1.1 Feature Set

### Authentication

- Register with 8+ character password and alphanumeric username constraints
- Login using email or username
- Logout
- JWT authentication using cross-domain HttpOnly cookies (`devpostify_token`)
- Protected routes

### Developer Profiles

- Public profile by username
- Edit name, bio, skills, specialties, GitHub, LinkedIn, and website
- Cloudinary avatar uploads
- Published-post listing

### Publishing

- Create, view, edit, and delete own posts
- Markdown editor with write/preview tabs
- `react-markdown`, `remark-gfm`, Prism code highlighting
- Five locked categories: `webdev`, `architecture`, `devops`, `opensource`, `ai`
- Cloudinary cover-image upload
- Private draft support

### Engagement

- Post reaction toggle and counters (atomic concurrency protected)
- Flat, single-level comments
- Author-only comment deletion
- Optimistic reaction/comment UI

### Notifications

- Persisted reaction/comment notifications; self-actions excluded
- Navbar unread badge
- `/notifications` activity feed
- Mark one/all as read
- Deep links (polling/request-driven, no WebSockets)

### Discovery and Bookmarks

- Latest / Top Insights sort
- Category and tag filters
- Search with input-length limits and regex sanitization (ReDoS protected)
- Bookmark/unbookmark
- `/bookmarks`

### Settings and UX

- Dark mode as the locked default (`#020617`)
- Account overview/session termination
- Accessible navigation and mobile drawer with aria attributes and scroll locking
- Loading/skeleton, empty, error boundaries (`error.tsx`), 404 (`not-found.tsx`), and toast states

---

## 4. Explicitly Out of Scope

Do not add WebSockets/Socket.IO, chat/DMs, AI integrations, communities/teams, full GitHub sync/OAuth, nested comments, voice/video, followers/following, recommendation engines, unnecessary infrastructure, or unrelated V2 features.

---

## 5. Design System

- Primary: `#2563EB`
- Accent: `#7C3AED`
- Brand gradient: blue → violet
- Background: `#020617`
- Typography: Poppins headings, Inter body, JetBrains Mono code
- Spacing: 8px system
- Radius: cards 16px; buttons/inputs 12px
- Preserve the existing identity; polish only where needed.

---

## 6. Locked Tech Stack and Architecture

- **Frontend:** Next.js App Router, React 19, strict TypeScript, Tailwind CSS, Lucide React, `react-markdown`, `remark-gfm`, Prism.
- **Backend:** Node.js, Express, TypeScript, JWT (`jsonwebtoken`), `cookie-parser`, Mongoose, Zod, Cloudinary SDK, Helmet, `express-rate-limit`.
- **Database/deployment:** MongoDB Atlas, Vercel frontend, Render backend.

```text
Next.js frontend
      ↓ HTTPS REST API
Express backend
      ↓ Mongoose
MongoDB Atlas
Do not replace this architecture.

7. Database Collections
users: credentials, bio, avatar, skills, specialties, socials

posts: content, category, tags, cover image, isDraft, reaction/comment counters, author

bookmarks: user/post references; unique compound index { user: 1, post: 1 }

reactions: user/post references; unique compound index { user: 1, post: 1 }

comments: post, author, content; index { post: 1, createdAt: -1 }

notifications: recipient, sender, type (reaction | comment), post/comment references, isRead

8. REST API Inventory
Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me

Posts: GET /api/posts, GET /api/posts/:id, POST /api/posts, PATCH /api/posts/:id, DELETE /api/posts/:id

Reactions: POST /api/posts/:id/react, GET /api/posts/:id/react

Comments: GET /api/posts/:id/comments, POST /api/posts/:id/comments, DELETE /api/comments/:commentId

Profile: GET /api/profile/:username, PATCH /api/profile

Notifications: GET /api/notifications, GET /api/notifications/unread-count, PATCH /api/notifications/read-all, PATCH /api/notifications/:id/read

Upload: POST /api/upload/signature

Bookmarks: GET /api/bookmarks, POST /api/bookmarks/:postId, DELETE /api/bookmarks/:postId

System: GET /api/search, GET /api/health

9. Milestone History & Status
Milestones 1–27 — Core V1 & V1.1 Feature Foundation
COMPLETE & VERIFIED. Models, Cloudinary media pipeline, profile extensions, reactions, flat comments, discovery/drafts persistence, notification center base, edit post, cover flow, and responsive drawer.

Milestone 28 — Auth-Aware Public Routes
COMPLETE & VERIFIED. Public GET routes support optional authentication for personalization states while keeping anonymous access working.

Milestone 29 — Draft Privacy Boundaries
COMPLETE & VERIFIED. Drafts strictly isolated from public feeds, search results, bookmarks, and non-owner access at the database level (isDraft: { $ne: true }).

Milestone 30 — Draft Management Workflow
COMPLETE & VERIFIED. Dedicated protected /drafts route with edit, publish, and delete actions restricted strictly to the author.

Milestone 31 — Delete / Cascade Integrity
COMPLETE & VERIFIED. Deleting posts cleans dependent reactions, comments, bookmarks, and notifications safely with atomic transactions.

Milestone 32 — Reaction / Comment Concurrency & Consistency
COMPLETE & VERIFIED. Atomic operations ($inc), unique compound indexes, and synchronized counts prevent race conditions.

Milestone 33 — TypeScript and Code Quality
COMPLETE & VERIFIED. Removed explicit as any type bypasses across components. Both frontend and backend compile strictly.

Milestone 34 — Upload & Input Validation Hardening
COMPLETE & VERIFIED. Cloudinary signed upload restricted to whitelisted folders (devpostify/covers, devpostify/avatars). Tags normalized (max 5, max 30 chars, lowercase, alphanumeric/dashes). Safe URL boundaries enforced.

Milestone 35 — API Security & Abuse Protection
COMPLETE & VERIFIED. Mounted helmet, configured express-rate-limit (general, auth, upload tiers), verified origin headers against CLIENT_URL for state mutations, and locked explicit database startup sequence.

Milestone 36 — Notification Reliability and UX
COMPLETE & VERIFIED. Click-to-read routing, semantic reaction vs comment styling, archived post fallbacks, and unread counters verified.

Milestone 37 — Premium Home Hero
COMPLETE & VERIFIED. Added SaaS-level hero with ambient glow, capability strip, and smooth #articles-feed anchor navigation without feed disruption.

Milestone 38 — Documentation, Env Contracts & Licensing
COMPLETE & VERIFIED. Root README.md synchronized with exact architecture and REST API inventory, added root LICENSE (MIT), and verified .env.example configurations.

Milestone 39 — Responsive and Accessibility (A11y) Audit
COMPLETE & VERIFIED. Audited semantic landmarks, added aria-expanded and aria-controls to mobile menu toggle, enforced aria-label="Mobile Navigation", and polished escape-key handling and body scroll locking.

Milestone 40 — Full Verification & Pre-Release Run
COMPLETE & VERIFIED. Ran clean npm run type-check and npm run build on backend (0 errors). Ran clean npm run lint and npm run build on frontend (0 errors, 0 warnings). OpenGraph, Twitter cards, metadata base, and production asset optimizations verified.

10. Next Milestone
Milestone 41 — Production Release & V1.1 Freeze 🔒 (NEXT)
Deploy backend to Render and frontend to Vercel.

Verify production environment variables (CLIENT_URL, MONGODB_URI, JWT_SECRET, CLOUDINARY_*, NEXT_PUBLIC_API_URL).

Verify cross-domain HttpOnly cookie delivery in production browsers.

Smoke test live URLs.

Mark DEVPOSTIFY NOVA V1.1 — COMPLETE & FROZEN.
```
