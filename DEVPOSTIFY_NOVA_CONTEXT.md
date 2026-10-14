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
- The user explicitly starts the next milestone with: “Done bhai ab next”.
- Never automatically continue to another milestone.

---

3. Locked V1 / V1.1 Feature Set

Authentication

- Register with password and username validation.
- Sign in using email or username.
- Logout and protected routes.
- JWT authentication through cross-domain HttpOnly cookies named "devpostify_token".

Developer Profiles

- Public profiles accessible by username.
- Edit profile information, bio, skills, specialties, and social links.
- GitHub, LinkedIn, and personal website links.
- Cloudinary avatar uploads.
- Published-post listings.

Publishing

- Create, view, edit, and delete posts.
- Markdown editor with Write and Preview modes.
- "react-markdown", "remark-gfm", and Prism syntax highlighting.
- Five locked categories: "webdev", "architecture", "devops", "opensource", "ai".
- Cloudinary cover-image uploads.
- Private drafts and a dedicated "/drafts" management page.

Engagement

- Post reaction toggle and reaction counters.
- Flat, single-level comments.
- Author-only comment deletion.
- Optimistic UI updates for supported interactions.

Notifications

- Persisted reaction and comment notifications; self-actions excluded.
- Navbar unread badge and "/notifications" activity feed.
- Mark one or all notifications as read.
- Deep links to relevant content.
- Request-driven updates; WebSockets are not part of V1.1.

Discovery and Bookmarks

- Latest and Top Insights sorting.
- Category and tag filters.
- Search with input validation and regex safeguards.
- Bookmark/unbookmark actions and "/bookmarks".

Settings and UX

- Dark-mode-first design with background "#020617".
- Account overview and session-related controls.
- Responsive layouts and mobile navigation.
- Accessible navigation controls and keyboard interactions.
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
- Preserve the established visual identity. Only make changes needed for correctness, usability, accessibility, or release quality.

---

6. Tech Stack and Architecture

- Frontend: Next.js App Router, React 19, strict TypeScript, Tailwind CSS 4, Lucide React, "react-markdown", "remark-gfm", Prism.
- Backend: Node.js, Express 5, TypeScript, JWT ("jsonwebtoken"), "cookie-parser", Mongoose, Zod, Cloudinary SDK, Helmet, "express-rate-limit".
- Database: MongoDB Atlas.
- Media: Cloudinary.
- Deployment targets: Vercel frontend and Render backend.

Next.js Frontend
|
| HTTPS REST API
| HttpOnly Cookies + CORS
v
Express Backend
|
| Mongoose
v
MongoDB Atlas

Express Backend ---- Signed Uploads ----> Cloudinary

Do not replace the architecture or introduce infrastructure without a concrete need.

---

7. Database Collections

- users: Credentials, profile information, bio, avatar, skills, specialties, and social links.
- posts: Content, category, tags, cover image, draft status, reaction/comment counters, and author reference.
- bookmarks: User/post references; unique compound index on "{ user: 1, post: 1 }".
- reactions: User/post references; unique compound index on "{ user: 1, post: 1 }".
- comments: Post, author, content, and creation time; index on "{ post: 1, createdAt: -1 }".
- notifications: Recipient, sender, type ("reaction" or "comment"), related post/comment references, and read status.

---

8. REST API Inventory

All routes use the "/api" prefix.

- Authentication: "POST /auth/register", "POST /auth/login", "POST /auth/logout", "GET /auth/me"
- Posts: "GET /posts", "GET /posts/:id", "POST /posts", "PATCH /posts/:id", "DELETE /posts/:id"
- Reactions: "POST /posts/:id/react", "GET /posts/:id/react"
- Comments: "GET /posts/:id/comments", "POST /posts/:id/comments", "DELETE /comments/:commentId"
- Profiles: "GET /profile/:username", "PATCH /profile"
- Notifications: "GET /notifications", "GET /notifications/unread-count", "PATCH /notifications/:id/read", "PATCH /notifications/read-all"
- Bookmarks: "GET /bookmarks", "POST /bookmarks/:postId", "DELETE /bookmarks/:postId"
- Uploads: "POST /upload/signature"
- Search: "GET /search"
- Health: "GET /health"

The implemented route definitions and validators remain authoritative if this inventory ever differs from the source code.

---

9. Milestone History and Status

Milestones 1–27 — Core V1 and V1.1 Feature Foundation: COMPLETE.

Core application foundations, publishing, profiles, media workflows, engagement, discovery, notifications, editing, and responsive navigation were implemented.

Milestones 28–36 — Security, Data Integrity, and Reliability: COMPLETE.

- M28 — Auth-Aware Public Routes: Optional authentication for public-route personalization.
- M29 — Draft Privacy: Drafts excluded from public discovery and restricted to their owner.
- M30 — Draft Management: Protected draft workflow for editing, publishing, and deletion.
- M31 — Delete/Cascade Integrity: Dependent-record cleanup for post deletion.
- M32 — Reaction/Comment Consistency: Concurrency and counter-consistency improvements.
- M33 — TypeScript and Code Quality: Type safety and removal of unnecessary explicit "any" bypasses.
- M34 — Upload and Input Validation: Upload-folder restrictions and normalized tag validation.
- M35 — API Security: Security headers, rate limits, origin checks, and database startup handling.
- M36 — Notification UX and Reliability: Read-state handling, navigation, and unread-count behavior.

Milestones 37–39 — Product Polish and Documentation: COMPLETE.

- M37 — Premium Home Hero: Home hero, capability strip, ambient styling, and feed navigation.
- M38 — Documentation, Environment Contracts, and Licensing: README, environment configuration documentation, and MIT license.
- M39 — Responsive and Accessibility Audit: Mobile navigation accessibility, Escape-key handling, and body scroll locking.

M40 — Full Verification and Pre-Release Preparation: COMPLETE, according to the latest project status.

The implementation and local verification phase is reported complete. The recorded verification checklist includes backend type-check/build, frontend lint/build, and metadata/production-asset review. Preserve the actual command outputs as the definitive evidence; do not claim a check passed if its result cannot be confirmed.

M41 — Production Release, End-to-End Testing, and V1.1 Freeze: NEXT AND ONLY REMAINING MILESTONE.

No new features are planned. Focus exclusively on release readiness, deployment, end-to-end testing, fixes for confirmed blockers, and final sign-off.

---

10. M41 — Release Checklist

A. Environment and Deployment

- [ ] Verify the final source and committed changes.
- [ ] Verify all required Render backend environment variables.
- [ ] Verify all required Vercel frontend environment variables, including "NEXT_PUBLIC_API_URL".
- [ ] Confirm "CLIENT_URL" matches the deployed frontend origin.
- [ ] Confirm MongoDB Atlas connectivity and database permissions.
- [ ] Confirm Cloudinary credentials and signed upload configuration.
- [ ] Deploy or verify the backend on Render.
- [ ] Deploy or verify the frontend on Vercel.
- [ ] Confirm the production health endpoint returns the expected result.

B. Authentication and Cookie Behavior

- [ ] Register and log in with valid credentials.
- [ ] Verify invalid credentials and validation errors.
- [ ] Verify email and username login as supported.
- [ ] Confirm the production HttpOnly cookie is issued with appropriate "Secure", "SameSite", domain, and credentialed-CORS behavior for the actual deployment.
- [ ] Verify protected routes reject unauthenticated requests.
- [ ] Verify logout clears the session correctly.

C. Publishing and Draft Privacy

- [ ] Create, edit, view, and delete a post.
- [ ] Create and update a draft, then publish it.
- [ ] Verify drafts do not appear in public feeds, search, or bookmarks.
- [ ] Verify anonymous users and other users cannot access another user's private drafts.
- [ ] Verify cover-image uploads and invalid upload requests.

D. Profiles, Engagement, and Discovery

- [ ] Update and view a developer profile.
- [ ] Verify reactions and reaction counters.
- [ ] Add and delete comments according to authorization rules.
- [ ] Verify notifications, unread counts, read actions, and deep links.
- [ ] Verify search, category/tag filtering, sorting, and bookmarks.
- [ ] Verify post deletion and cleanup of dependent records.
- [ ] Test validation errors and relevant concurrent interaction cases.

E. UX, Accessibility, and Stability

- [ ] Test desktop and mobile layouts.
- [ ] Test mobile navigation, keyboard interactions, and Escape-key handling.
- [ ] Check loading, empty, error, and toast states.
- [ ] Inspect browser console and production network requests.
- [ ] Verify important links, refresh behavior, and direct navigation to nested routes.
- [ ] Check backend logs for unexpected errors.

F. Final Sign-Off

- [ ] Record the actual production test results.
- [ ] Fix and retest confirmed release blockers.
- [ ] Confirm the deployed frontend and backend work together.
- [ ] Update this context file with the final verified results and any known limitations.
- [ ] Commit final documentation/status changes.
- [ ] Mark DEVPOSTIFY NOVA V1.1 — COMPLETE & FROZEN only after the release checks pass.

Do not add features during M41. Fix only confirmed release blockers and avoid unnecessary refactoring.

---

11. Current State and Next Action

- V1/V1.1 feature implementation is complete.
- M40 is recorded as complete in the latest project status.
- M41 is the only remaining milestone.
- Production deployment, end-to-end testing, and final release verification must be recorded after they are actually performed.
- Next action: execute M41, report actual results, resolve confirmed blockers, and freeze V1.1 after successful verification.

Final project status must reflect evidence, not assumptions.
