# DevPostify Nova

> Where Developers Build Their Identity.

DevPostify Nova is a developer-first professional technical publishing and identity platform. It is engineered to help software engineers publish deep-dive architectural insights, showcase verified project expertise, engage in focused technical discussions, and curate bookmarks.

---

## ⚡ Core Features (V1.1)

- **Authentication & Security:**
  - Secure credential registration and login with username or email.
  - Cross-domain HttpOnly cookie authentication powered by JSON Web Tokens (JWT).
  - Production-grade security headers with Helmet and strict origin verification on state mutations.
  - Tiered rate-limiting on sensitive authentication and media upload endpoints.

- **Technical Publishing & Draft Workflow:**
  - Markdown editor with live Write / Preview modes (`react-markdown`, `remark-gfm`, Prism syntax highlighting).
  - Five locked technical domains: `webdev`, `architecture`, `devops`, `opensource`, `ai`.
  - Secure, signed Cloudinary cover-image upload pipeline.
  - Private drafts isolated at the database level with a dedicated `/drafts` management dashboard.

- **Developer Identity & Profiles:**
  - Custom developer profiles indexed by `@username`.
  - Showcase technical specialties, core skills, GitHub, LinkedIn, and personal websites.
  - Avatar uploads powered by Cloudinary with client/server validation.

- **Engineering Engagement & Discussions:**
  - Race-safe, atomic post reactions with optimistic UI updates.
  - Flat, single-level technical discussion threads with author deletion privileges.
  - Persistent notification stream with deep linking and unread badge counters.

- **Discovery & Discovery Controls:**
  - Sort by Latest or Top Insights.
  - Category tabs and tag filtering.
  - ReDoS-protected search with strict input boundaries and regex escaping.
  - Instant post bookmarking with dedicated `/bookmarks` view.

---

## 🛠️ Architecture & Tech Stack

```text
Next.js 15 (App Router, React 19)
       │
       │  HTTPS REST API (HttpOnly Cookies, CORS, Rate Limited)
       ▼
Express Backend (Node.js, TypeScript)
       │
       │  Mongoose ODM
       ▼
MongoDB Atlas  ◄─── Signed Uploads ───►  Cloudinary CDN
Frontend: Next.js (App Router), React 19, Strict TypeScript, Tailwind CSS, Lucide React.

Backend: Node.js, Express, TypeScript, Mongoose, Zod, Helmet, express-rate-limit.

Database: MongoDB Atlas.

Media Pipeline: Cloudinary Signed Uploads.

Deployment: Vercel (Frontend), Render (Backend).

📡 REST API Inventory
Authentication
POST /api/auth/register — Create account

POST /api/auth/login — Sign in and issue HttpOnly cookie

POST /api/auth/logout — Invalidate session cookie

GET  /api/auth/me — Restore current authenticated user

Technical Posts
GET    /api/posts — Fetch published feed (supports category, tag, sort)

GET    /api/posts/:id — Fetch post detail (auth-aware draft access)

POST   /api/posts — Create publication or draft

PATCH  /api/posts/:id — Update post or publish draft

DELETE /api/posts/:id — Cascade delete post and dependent relations

Reactions & Discussions
POST   /api/posts/:id/react — Atomic toggle reaction

GET    /api/posts/:id/react — Check reaction status

GET    /api/posts/:id/comments — Fetch post comments

POST   /api/posts/:id/comments — Add comment

DELETE /api/comments/:commentId — Delete comment (author-only)

Developer Profile
GET   /api/profile/:username — Fetch developer profile and publications

PATCH /api/profile — Update bio, skills, specialties, and socials

Notifications & Bookmarks
GET   /api/notifications — Fetch notification stream

GET   /api/notifications/unread-count — Unread count for navbar badge

PATCH /api/notifications/:id/read — Mark notification read

PATCH /api/notifications/read-all — Mark all notifications read

GET   /api/bookmarks — List bookmarked articles

POST  /api/bookmarks/:postId — Bookmark article

DELETE /api/bookmarks/:postId — Remove bookmark

System & Media
POST /api/upload/signature — Generate signed Cloudinary upload params

GET  /api/search — ReDoS-protected fuzzy search

GET  /api/health — Healthcheck and uptime monitor

🚀 Local Development Setup
1. Prerequisites
Node.js 20+

MongoDB instance (local or Atlas)

Cloudinary account for media hosting

2. Backend Setup
Bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI, JWT_SECRET, and Cloudinary credentials
npm run dev
3. Frontend Setup
Bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
The application will be live at http://localhost:3000.

📜 License
Distributed under the MIT License.
```
