DevPostify Nova

«Where Developers Build Their Identity.»

DevPostify Nova is a developer-first professional technical publishing and identity platform built to help developers share technical knowledge, showcase their expertise, participate in focused discussions, discover useful content, and curate valuable posts.

The project focuses on a polished developer experience, maintainable architecture, secure authentication, and practical full-stack engineering.

✨ Core Features

Authentication & Security

- Register and sign in using email or username.
- JWT-based authentication using cross-domain HttpOnly cookies.
- Security headers powered by Helmet.
- Origin verification for state-changing requests.
- Rate limiting for general API traffic, authentication, and media uploads.

Technical Publishing

- Create, edit, view, and delete technical posts.
- Markdown editor with Write and Preview modes.
- GitHub Flavored Markdown and syntax highlighting.
- Five supported categories: "webdev", "architecture", "devops", "opensource", and "ai".
- Cover-image uploads through signed Cloudinary uploads.
- Private drafts with a dedicated draft-management dashboard.

Developer Profiles

- Public developer profiles accessible by username.
- Profile editing for bio, skills, specialties, and social links.
- GitHub, LinkedIn, and personal website links.
- Cloudinary-powered avatar uploads.
- Published-post listings on developer profiles.

Engagement & Notifications

- Post reactions with optimistic UI updates.
- Flat, single-level comment discussions.
- Author-only comment deletion.
- Persistent reaction and comment notifications.
- Unread notification counts and mark-as-read actions.
- Notification links to relevant posts.

Discovery & Bookmarks

- Latest and Top Insights feed sorting.
- Category and tag filtering.
- Search with input validation and regex safeguards.
- Bookmark and unbookmark functionality.
- Dedicated bookmarks page.

User Experience

- Dark-mode-first visual design.
- Responsive layouts and mobile navigation.
- Loading skeletons, empty states, error handling, and toast feedback.
- Accessible navigation controls and keyboard interactions.

🛠️ Tech Stack

Layer| Technologies
Frontend| Next.js 16 (App Router), React 19, TypeScript
Styling & UI| Tailwind CSS 4, Lucide React
Markdown| "react-markdown", "remark-gfm", Prism syntax highlighting
Backend| Node.js, Express 5, TypeScript
Validation & Security| Zod, JWT, "cookie-parser", Helmet, "express-rate-limit"
Database| MongoDB Atlas, Mongoose
Media| Cloudinary
Frontend Deployment| Vercel
Backend Deployment| Render

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
│ Application Data│ │ Media Uploads │
└──────────────────┘ └──────────────────┘

📡 REST API Overview

All routes below use the "/api" prefix.

Authentication

Method| Endpoint| Purpose
POST| "/auth/register"| Create an account
POST| "/auth/login"| Sign in
POST| "/auth/logout"| Clear the session cookie
GET| "/auth/me"| Retrieve the current authenticated user

Posts

Method| Endpoint| Purpose
GET| "/posts"| Retrieve the published feed
GET| "/posts/:id"| Retrieve a post, subject to access rules
POST| "/posts"| Create a post or draft
PATCH| "/posts/:id"| Update a post or publish a draft
DELETE| "/posts/:id"| Delete a post and its dependent records

The feed supports discovery options such as category, tag, and sorting where applicable.

Reactions & Comments

Method| Endpoint| Purpose
POST| "/posts/:id/react"| Toggle a reaction
GET| "/posts/:id/react"| Retrieve the current user's reaction status
GET| "/posts/:id/comments"| Retrieve post comments
POST| "/posts/:id/comments"| Add a comment
DELETE| "/comments/:commentId"| Delete an eligible comment

Developer Profiles

Method| Endpoint| Purpose
GET| "/profile/:username"| Retrieve a developer profile
PATCH| "/profile"| Update the authenticated user's profile

Notifications & Bookmarks

Method| Endpoint| Purpose
GET| "/notifications"| Retrieve notifications
GET| "/notifications/unread-count"| Retrieve the unread count
PATCH| "/notifications/:id/read"| Mark a notification as read
PATCH| "/notifications/read-all"| Mark all notifications as read
GET| "/bookmarks"| Retrieve bookmarked posts
POST| "/bookmarks/:postId"| Bookmark a post
DELETE| "/bookmarks/:postId"| Remove a bookmark

Search, Media & Health

Method| Endpoint| Purpose
GET| "/search"| Search published content
POST| "/upload/signature"| Generate signed Cloudinary upload parameters
GET| "/health"| Check backend health

🚀 Local Development Setup

Prerequisites

- Node.js 20 or a compatible version supported by the installed dependencies.
- npm.
- A MongoDB Atlas database or local MongoDB instance.
- A Cloudinary account for media uploads.

1. Clone the repository

git clone <YOUR_REPOSITORY_URL>
cd DevPostify-Nova

Replace "<YOUR_REPOSITORY_URL>" with the actual Git repository URL.

2. Configure the backend

cd backend
npm install

Create a ".env" file by copying ".env.example", then configure the required values.

Typical configuration includes:

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Use the variable names and any additional required settings from the repository's "backend/.env.example". Never commit real credentials.

Start the backend:

npm run dev

Keep this terminal running.

3. Configure the frontend

Open a second terminal:

cd frontend
npm install

Create a ".env.local" file in the "frontend" directory containing:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

If your backend uses a different local port, update the URL accordingly.

Start the frontend:

npm run dev

Open "http://localhost:3000" (http://localhost:3000).

4. Available verification scripts

Run the scripts from their respective directories.

Backend:

npm run type-check
npm run build

Frontend:

npm run lint
npm run build

A successful local build does not replace production deployment checks or live end-to-end testing.

🔐 Security Notes

- Keep secrets in environment variables and never commit ".env" files.
- Use HTTPS and correctly configured production origins when deploying.
- Keep MongoDB credentials and Cloudinary API secrets on the backend.
- The frontend API URL is public configuration, not a secret.
- Verify cookie delivery, authentication, access control, uploads, and draft privacy in the deployed environment.

📌 Project Status

V1.1 development and implementation milestones are complete. The final production release milestone covers deployment verification, environment configuration, cross-domain cookie behavior, and end-to-end smoke testing.

The project should be considered fully release-verified only after those production checks pass.

📜 License

This project is distributed under the MIT License. See "LICENSE" (LICENSE) for details.
