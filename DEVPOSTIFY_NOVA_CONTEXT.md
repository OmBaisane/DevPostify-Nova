DEVPOSTIFY NOVA — PROJECT CONTEXT

«Source of truth for DevPostify Nova continuity. Keep this file accurate and concise.
The repository is the source of truth for implementation details.
Never claim a command, test, deployment, or verification passed unless it actually did.
Workflow: PLAN → EXECUTE → VERIFY → TEST → COMMIT → REPORT → STOP.»

---

1. Project Identity

- Public name: DevPostify
- Development name: DevPostify Nova
- Tagline: Where Developers Build Their Identity.
- Product: Developer-first professional technical publishing and identity platform.
- Vision: Help developers share technical knowledge, showcase expertise, participate in focused discussions, discover useful content, and save valuable posts.
- Experience: Premium, professional, developer-first, and SaaS-quality.
- Old DevPostify is reference-only and must never become a dependency.

---

2. Development Principles

- Keep the V1/V1.1 scope locked. Do not introduce unrelated V2 features.
- Prefer practical, maintainable, production-oriented solutions.
- Inspect actual repository code before assuming something is missing or complete.
- Record verification results honestly; distinguish passed, failed, skipped, and not verified.
- Update this file after meaningful milestones.
- Gemini handles implementation; ChatGPT supports architecture, audits, review, and final polish.
- The user explicitly starts the next milestone with: "Done bhai ab next".
- Never automatically continue to another milestone.

---

3. Locked V1 / V1.1 Feature Set

Authentication

- Register with password and username validation.
- Sign in using email or username.
- Logout and protected routes.
- JWT authentication through cross-domain HttpOnly cookies named "devpostify_token".

Developer Profiles

- Public profiles accessible by username at "/profile/:username".
- Edit profile information, bio, skills, specialties, and social links.
- GitHub, LinkedIn, and personal website links.
- Cloudinary avatar uploads.
- Published-post listings with viewer-aware reaction states.

Publishing

- Create, view, edit, and delete posts.
- Markdown editor with Write and Preview modes.
- "react-markdown", "remark-gfm", and Prism syntax highlighting.
- Five locked categories: "webdev", "architecture", "devops", "opensource", and "ai".
- Cloudinary cover-image uploads using signed upload parameters.
- Private drafts and a dedicated "/drafts" management page.

Engagement

- Post reaction toggle and reaction counters with concurrency protections.
- Flat, single-level comments.
- Author-only comment deletion.
- Optimistic UI updates for supported interactions.

Notifications

- Persisted reaction and comment notifications; self-actions excluded.
- Navbar unread badge and "/notifications" activity feed.
- Mark one or all notifications as read using the "isRead" property.
- Deep links to relevant content.
- Request-driven updates; WebSockets are not part of V1.1.

Discovery and Bookmarks

- Latest and Top Insights sorting.
- Category and tag filters.
- Search with input validation and regex safeguards.
- Bookmark and unbookmark actions.
- Dedicated "/bookmarks" page with viewer-aware reaction states.

Settings and UX

- Dark-mode-first design with background "#020617".
- Account overview and session-related controls.
- Responsive layouts and accessible mobile navigation.
- Keyboard interactions and appropriate navigation accessibility attributes.
- Loading skeletons, empty states, error handling, error boundaries, 404 handling, and toast feedback.

---

4. Explicitly Out of Scope

Do not add WebSockets/Socket.IO, chat or DMs, AI integrations, communities or teams, full GitHub sync/OAuth, nested comments, voice/video, followers/following, recommendation engines, unnecessary infrastructure, or unrelated V2 features.

---

5. Design System

- Primary: "#2563EB"
- Accent: "#7C3AED"
- Brand gradient: Blue to violet
- Background: "#020617"
- Typography: Poppins headings, Inter body, JetBrains Mono code
- Spacing: 8px system
- Radius: 16px cards; 12px buttons and inputs

Preserve the established visual identity. Make further changes only when justified by correctness, usability, accessibility, or release quality.

---

6. Tech Stack and Architecture

- Frontend: Next.js App Router, React 19, strict TypeScript, Tailwind CSS 4, Lucide React, "react-markdown", "remark-gfm", Prism.
- Backend: Node.js, Express 5, TypeScript, JWT ("jsonwebtoken"), "cookie-parser", Mongoose, Zod, Cloudinary SDK, Helmet, "express-rate-limit".
- Database: MongoDB Atlas.
- Media: Cloudinary.
- Deployment: Vercel frontend and Render backend.

Next.js Frontend
|
| HTTPS REST API
| HttpOnly Cookies + CORS
v
Express Backend
|
+-------------------+
| |
v v
MongoDB Atlas Cloudinary CDN
Application Data Media Uploads

Do not replace the architecture or introduce infrastructure without a concrete need.

---

7. Database Collections

- users: Credentials, profile information, bio, avatar, skills, specialties, and social links.
- posts: Content, category, tags, cover image, draft status, reaction/comment counters, and author reference.
- bookmarks: User/post references; unique compound index on "{ user: 1, post: 1 }".
- reactions: User/post references; unique compound index on "{ user: 1, post: 1 }".
- comments: Post, author, content, and creation time; index on "{ post: 1, createdAt: -1 }".
- notifications: Recipient, sender, type ("reaction" or "comment"), related post/comment references, and read status ("isRead").

---

8. REST API Inventory

All endpoints below use the "/api" prefix.

Authentication

Method| Endpoint| Purpose
POST| "/auth/register"| Create an account
POST| "/auth/login"| Sign in with email or username
POST| "/auth/logout"| Clear the session cookie
GET| "/auth/me"| Retrieve the authenticated user

Posts

Method| Endpoint| Purpose
GET| "/posts"| Retrieve the published feed
GET| "/posts/:id"| Retrieve a post, subject to access rules
POST| "/posts"| Create a post or private draft
PATCH| "/posts/:id"| Update a post or publish a draft
DELETE| "/posts/:id"| Delete a post and dependent records

Reactions and Comments

Method| Endpoint| Purpose
POST| "/posts/:id/react"| Toggle a post reaction
GET| "/posts/:id/react"| Retrieve the current user's reaction status
GET| "/posts/:id/comments"| Retrieve comments
POST| "/posts/:id/comments"| Add a comment
DELETE| "/comments/:commentId"| Delete an eligible comment

Profiles

Method| Endpoint| Purpose
GET| "/profile/:username"| Retrieve a developer profile
PATCH| "/profile"| Update the authenticated user's profile

Notifications

Method| Endpoint| Purpose
GET| "/notifications"| Retrieve notifications
GET| "/notifications/unread-count"| Retrieve the unread count
PATCH| "/notifications/:id/read"| Mark one notification as read
PATCH| "/notifications/read-all"| Mark all notifications as read

Bookmarks

Method| Endpoint| Purpose
GET| "/bookmarks"| Retrieve bookmarked posts
POST| "/bookmarks/:postId"| Bookmark a post
DELETE| "/bookmarks/:postId"| Remove a bookmark

Search, Media, and Health

Method| Endpoint| Purpose
GET| "/search"| Search published content
POST| "/upload/signature"| Generate signed Cloudinary upload parameters
GET| "/health"| Check backend health

The implemented route definitions remain authoritative if this inventory ever differs from the source code.

---

9. Milestone History and Status

Milestones 1–27 — Core V1 and V1.1 Feature Foundation

Status: COMPLETE.

Core application foundations, publishing, profiles, media workflows, engagement, discovery, notifications, post editing, and responsive navigation were implemented.

Milestones 28–36 — Security, Data Integrity, and Reliability

Status: COMPLETE.

- M28 — Auth-Aware Public Routes: Optional authentication for public-route personalization.
- M29 — Draft Privacy: Drafts excluded from public discovery and restricted to their owner.
- M30 — Draft Management: Protected draft workflow for editing, publishing, and deletion.
- M31 — Delete/Cascade Integrity: Dependent-record cleanup for post deletion.
- M32 — Reaction/Comment Consistency: Concurrency and counter-consistency improvements.
- M33 — TypeScript and Code Quality: Type safety and removal of unnecessary explicit "any" bypasses.
- M34 — Upload and Input Validation: Upload restrictions and normalized tag validation.
- M35 — API Security: Security headers, rate limits, origin checks, and database startup handling.
- M36 — Notification UX and Reliability: Read-state handling, navigation, and unread-count behavior.

Milestones 37–39 — Product Polish and Documentation

Status: COMPLETE.

- M37 — Premium Home Hero: Home hero, capability strip, ambient styling, and feed navigation.
- M38 — Documentation, Environment Contracts, and Licensing: README, environment documentation, and MIT license.
- M39 — Responsive and Accessibility Audit: Mobile navigation accessibility, Escape-key handling, and body scroll locking.

M40 — Full Verification and Pre-Release Preparation

Status: COMPLETE, as recorded by the project owner.

Recorded checks include:

- Backend type-check and build.
- Frontend lint and build.
- Metadata, Open Graph, and Twitter card review.

Retain the actual command outputs as verification evidence. Do not claim an individual check passed if its result cannot be confirmed.

M41 — Production Release, End-to-End Testing, and V1.1 Freeze

Status: COMPLETE AND FROZEN, as recorded by the project owner.

The final release pass records the following fixes and checks:

- Profile and bookmark responses include viewer-aware reaction state ("isReactedByMe").
- Notification read-state naming is aligned around "isRead".
- Production frontend and backend deployments were verified.
- Reaction and comment counter mutation flows received concurrency improvements.
- Cloudinary upload restrictions were strengthened.
- Production environment configuration, authentication, draft privacy, core publishing, engagement, discovery, responsive behavior, and release checks were recorded as verified.

The deployed application and the actual source code remain authoritative. If any check needs to be repeated, record its new result honestly.

---

10. Final Release Verification Record

The project owner reports completion of the following release checks. Keep this record aligned with the actual test results.

A. Environment and Deployment

- [x] Final source and committed changes checked.
- [x] Required Render and Vercel environment variables checked.
- [x] "CLIENT_URL", "NEXT_PUBLIC_API_URL", and "NEXT_PUBLIC_APP_URL" checked.
- [x] MongoDB Atlas connectivity and permissions checked.
- [x] Cloudinary configuration checked.
- [x] Backend and frontend deployment verified.
- [x] Production health endpoint checked.

B. Authentication and Cookies

- [x] Registration and valid login checked.
- [x] Invalid credentials and validation errors checked.
- [x] Email and username login checked where supported.
- [x] Production HttpOnly cookie and credentialed-CORS behavior checked.
- [x] Protected-route access checked.
- [x] Logout behavior checked.

C. Publishing and Draft Privacy

- [x] Post creation, editing, viewing, and deletion checked.
- [x] Draft creation, editing, and publishing checked.
- [x] Draft exclusion from public feed, search, and bookmarks checked.
- [x] Anonymous and non-owner draft access restrictions checked.
- [x] Valid and invalid upload requests checked.

D. Profiles, Engagement, and Discovery

- [x] Profile editing and display checked.
- [x] Viewer-aware reaction states checked.
- [x] Reactions and counters checked.
- [x] Comment authorization and counter behavior checked.
- [x] Notifications, unread counts, read actions, and deep links checked.
- [x] Search, filtering, sorting, and bookmarks checked.
- [x] Post deletion and dependent-record cleanup checked.
- [x] Validation errors and relevant concurrent interactions checked.

E. UX, Accessibility, and Stability

- [x] Desktop and mobile layouts checked.
- [x] Mobile navigation and keyboard interactions checked.
- [x] Loading, empty, error, and toast states checked.
- [x] Browser console and production network requests inspected.
- [x] Important links, refresh behavior, and nested routes checked.
- [x] Backend logs checked for unexpected errors.

F. Final Sign-Off

- [x] Reported release checks recorded.
- [x] Confirmed release blockers addressed and retested.
- [x] Deployed frontend and backend integration checked.
- [x] Final project documentation updated.
- [x] V1.1 marked complete and frozen.

---

11. Current State and Final Status

- V1/V1.1 feature implementation is complete.
- M40 and M41 are recorded as complete.
- Final status: DEVPOSTIFY NOVA V1.1 — COMPLETE & FROZEN.
- No new features, scope expansions, or architectural refactoring are planned under V1.1.
- Any future work must be a separately scoped maintenance task or a new version.

Final project status must reflect actual implementation and verification evidence, not assumptions.
