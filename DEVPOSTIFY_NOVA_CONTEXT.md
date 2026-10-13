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
- JWT authentication using cross-domain HttpOnly cookies
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

- Post reaction toggle and counters
- Flat, single-level comments
- Author-only comment deletion
- Optimistic reaction/comment UI

### Notifications

- Persisted reaction/comment notifications; self-actions excluded
- Navbar unread badge
- `/notifications` activity feed
- Mark one/all as read
- Deep links

**Accuracy note:** Do not describe notifications as WebSocket/realtime-powered. There is no realtime socket system in V1.1; describe the actual refresh/polling behavior accurately.

### Discovery and Bookmarks

- Latest / Top Insights sort
- Category and tag filters
- Search with input-length limits and regex sanitization (ReDoS protected)
- Bookmark/unbookmark
- `/bookmarks`

### Settings and UX

- Dark mode as the locked default
- Account overview/session termination
- Responsive navigation and mobile drawer
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

bookmarks: user/post references; unique compound index

reactions: user/post references; unique compound index

comments: post, author, content; index { post: 1, createdAt: -1 }

notifications: recipient, sender, type (reaction | comment), post/comment references, read

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
COMPLETE & VERIFIED. Deleting posts cleans dependent reactions, comments, bookmarks, and notifications safely.

Milestone 32 — Reaction / Comment Concurrency & Consistency
COMPLETE & VERIFIED. Atomic operations ($inc), unique constraints, and synchronized counters prevent race conditions.

Milestone 33 — TypeScript and Code Quality
COMPLETE & VERIFIED. Removed as any bypasses across ToastContext, ReactionButton, CommentSection, drafts, and post pages. Both frontend and backend compile strictly.

Milestone 34 — Upload & Input Validation Hardening
COMPLETE & VERIFIED. Cloudinary signed upload restricted to whitelisted folders (devpostify/covers, devpostify/avatars). Tags normalized (max 5, max 30 chars, lowercase, alphanumeric/dashes). Safe URL boundaries enforced.

Milestone 35 — API Security & Abuse Protection
COMPLETE & VERIFIED. Mounted helmet, configured express-rate-limit (general, auth, upload tiers), verified origin headers against CLIENT_URL for state mutations, and locked explicit database startup sequence.

Milestone 36 — Notification Reliability and UX
COMPLETE & VERIFIED. Click-to-read routing, semantic reaction vs comment styling, archived post fallbacks, and unread counters verified.

10. Remaining Execution Roadmap
Milestone 37 — Premium Home Hero (CURRENT NEXT)
Improve first impression of home/feed page while preserving feed usability.

Locked Copy:

Eyebrow: DEVELOPER-FIRST ENGINEERING PLATFORM

Headline: Where Developers Build Their Identity.

Supporting copy: Publish technical knowledge, showcase your expertise, and discover engineering insights built for developers.

Logged-out CTAs: Explore Insights, Get Started

Logged-in CTAs: Explore Insights, Write an Article

Capability strip: Technical Publishing • Developer Profiles • Engineering Discussions

Design: Dark surface, restrained blue/violet glow, JetBrains Mono tags, clean hierarchy, responsive. No fake stats/testimonials.

Milestone 38 — README, Environment Example & License
Update root README with actual architecture, verified REST endpoints, and screenshots/specs.

Ensure backend/.env.example has all Cloudinary, JWT, Mongo, Client URL keys.

Add standard root MIT LICENSE and sync package.json metadata.

Milestone 39 — Responsive and Accessibility Audit
Audit desktop/tablet/mobile screens.

Verify semantic landmarks (single main landmark, no nesting), button labels, focus rings, keyboard navigability, image alts, toast accessibility.

Check mobile drawer transitions and scroll locks.

Milestone 40 — Full Verification & Pre-Release Run
Run full checks across both workspaces:

Frontend: npm run lint, npm run build

Backend: npm run type-check, npm run build

Smoke test critical flows: auth, posting, drafting, reactions, comments, search, bookmarks, profiles.

Milestone 41 — Production Release & V1.1 Freeze 🔒
Deploy backend to Render and frontend to Vercel.

Verify production environment variables and cross-domain HttpOnly cookie delivery.

Smoke test live URLs.

Mark DEVPOSTIFY NOVA V1.1 — COMPLETE / FROZEN.
```
