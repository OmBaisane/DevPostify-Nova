DevPostify Nova

«Where Developers Build Their Identity.»

DevPostify Nova is a developer-first professional technical publishing and identity platform built to help developers share technical knowledge, showcase their expertise, participate in focused discussions, discover useful content, and curate valuable posts.

The project focuses on a polished developer experience, maintainable architecture, secure authentication, and practical full-stack engineering.

---

✨ Core Features

Authentication & Security

- Register and sign in using email or username.
- JWT-based authentication using cross-domain HttpOnly cookies ("devpostify_token").
- Security headers powered by Helmet.
- Origin verification for state-changing requests.
- Rate limiting for general API traffic, authentication, and media uploads.

Technical Publishing

- Create, edit, view, and delete technical posts.
- Markdown editor with Write and Preview modes.
- GitHub Flavored Markdown through "remark-gfm" and syntax highlighting with Prism.
- Five supported categories: "webdev", "architecture", "devops", "opensource", and "ai".
- Cover-image uploads through signed Cloudinary uploads.
- Private drafts with database-level access restrictions and a dedicated "/drafts" dashboard.

Developer Profiles

- Public developer profiles accessible by username.
- Profile editing for bio, skills, specialties, and social links.
- GitHub, LinkedIn, and personal website links.
- Cloudinary-powered avatar uploads.
- Published-post listings with viewer-aware reaction states.

Engagement & Notifications

- Post reactions with optimistic UI updates and concurrency protections.
- Flat, single-level technical discussions with author-only comment deletion.
- Persistent reaction and comment notifications, excluding self-actions.
- Unread notification counters and mark-as-read actions.
- Deep links to relevant posts.

Discovery & Bookmarks

- Latest and Top Insights feed sorting.
- Category and tag filtering.
- Search with input validation and regex safeguards.
- Bookmark and unbookmark functionality.
- Dedicated "/bookmarks" page with viewer-aware reaction states.

User Experience

- Dark-mode-first visual design with "#020617" background.
- Responsive layouts and accessible mobile navigation.
- Loading skeletons, empty states, error boundaries, and toast feedback.

---

🛠️ Tech Stack

Layer| Technologies
Frontend| Next.js 16 App Router, React 19, TypeScript
Styling & UI| Tailwind CSS 4, Lucide React
Markdown| "react-markdown", "remark-gfm", Prism.js
Backend| Node.js, Express 5, TypeScript
Validation & Security| Zod, JWT, "cookie-parser", Helmet, "express-rate-limit"
Database| MongoDB Atlas, Mongoose
Media| Cloudinary signed uploads
Frontend Deployment| Vercel
Backend Deployment| Render

---

🏗️ Architecture

┌─────────────────────────────────┐
│ Next.js Frontend │
│ React + TypeScript │
└────────────────┬────────────────┘
│
│ HTTPS REST API
│ HttpOnly Cookies + CORS
▼
┌─────────────────────────────────┐
│ Express Backend │
│ TypeScript + Mongoose │
└───────────┬─────────────┬───────┘
│ │
▼ ▼
┌──────────────────┐ ┌──────────────────┐
│ MongoDB Atlas │ │ Cloudinary CDN │
│ Application Data │ │ Media Uploads │
└──────────────────┘ └──────────────────┘

---

📡 REST API Reference

All endpoints below use the "/api" prefix.

Authentication

Method| Endpoint| Purpose
POST| "/auth/register"| Create an account
POST| "/auth/login"| Sign in with email or username
POST| "/auth/logout"| Clear the session cookie
GET| "/auth/me"| Retrieve the authenticated user

Posts & Drafts

Method| Endpoint| Purpose
GET| "/posts"| Retrieve the published feed
GET| "/posts/:id"| Retrieve a post, subject to access rules
POST| "/posts"| Create a post or private draft
PATCH| "/posts/:id"| Update a post or publish a draft
DELETE| "/posts/:id"| Delete a post and its dependent records

Reactions & Comments

Method| Endpoint| Purpose
POST| "/posts/:id/react"| Toggle a post reaction
GET| "/posts/:id/react"| Retrieve the current user's reaction status
GET| "/posts/:id/comments"| Retrieve comments
POST| "/posts/:id/comments"| Add a comment
DELETE| "/comments/:commentId"| Delete an eligible comment

Developer Profiles

Method| Endpoint| Purpose
GET| "/profile/:username"| Retrieve a developer profile and published posts
PATCH| "/profile"| Update the authenticated user's profile

Notifications

Method| Endpoint| Purpose
GET| "/notifications"| Retrieve the notification stream
GET| "/notifications/unread-count"| Retrieve the unread notification count
PATCH| "/notifications/:id/read"| Mark a notification as read
PATCH| "/notifications/read-all"| Mark all notifications as read

Bookmarks

Method| Endpoint| Purpose
GET| "/bookmarks"| Retrieve bookmarked posts
POST| "/bookmarks/:postId"| Bookmark a post
DELETE| "/bookmarks/:postId"| Remove a bookmark

Search, Media & Health

Method| Endpoint| Purpose
GET| "/search"| Search published content
POST| "/upload/signature"| Generate signed Cloudinary upload parameters
GET| "/health"| Check backend health

---

🚀 Local Development Setup

Prerequisites

- Node.js 20 or a compatible version supported by the installed dependencies.
- npm.
- A MongoDB Atlas cluster or local MongoDB instance.
- A Cloudinary account for media uploads.

1. Clone the repository

Clone the repository using your actual Git remote URL:

git clone <YOUR_REPOSITORY_URL>
cd DevPostify-Nova

Replace "<YOUR_REPOSITORY_URL>" with the repository's real clone URL.

2. Configure the backend

Open a terminal in the repository root:

cd backend
npm install

Create a ".env" file based on "backend/.env.example". Configure the required values, including your database connection, JWT secret, client origin, and Cloudinary credentials.

Typical local values look like this:

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Use the exact variable names and any additional settings documented in the actual backend environment example.

Start the backend:

npm run dev

Keep this terminal running.

3. Configure the frontend

Open a second terminal from the repository root:

cd frontend
npm install

Create "frontend/.env.local" based on "frontend/.env.example".

Typical local values:

NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

Use the correct deployed frontend origin for "NEXT_PUBLIC_APP_URL" in the production environment. "NEXT_PUBLIC_API_URL" must point to the deployed backend API when running in production.

Start the frontend:

npm run dev

Open "http://localhost:3000" (http://localhost:3000).

«Run the frontend and backend in separate terminals. Never commit real ".env" or ".env.local" files or expose private credentials.»

---

🧪 Verification Scripts

Run the commands from their respective project directories.

Backend

cd backend
npm run type-check
npm run build

Frontend

cd frontend
npm run lint
npm run build

Use the scripts defined in each directory's "package.json". A successful local build does not replace production smoke tests or end-to-end verification.

---

🔐 Security Notes

- Keep secrets in environment variables and never commit them to the repository.
- Use HTTPS and correctly configured production origins.
- Configure cross-domain authentication cookies and credentialed CORS consistently with the deployed frontend and backend.
- Keep MongoDB credentials and Cloudinary API secrets on the backend.
- Treat "NEXT*PUBLIC*\*" variables as public configuration; never place secrets in them.
- Enforce upload restrictions through trusted server-side/provider-side controls, not browser validation alone.
- Verify authentication, authorization, draft privacy, upload restrictions, and session behavior in the deployed environment.

---

📌 Project Status

DevPostify Nova V1.1 — COMPLETE & FROZEN.

The project owner reports completion of the feature implementation, hardening, deployment, and final release-verification milestones. No additional V1.1 features or scope expansions are planned.

Any future work should be treated as a separately scoped maintenance task or a new version.

---

📜 License

This project is licensed under the MIT License. See "LICENSE" (LICENSE) for details.
