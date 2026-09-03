# DevPostify Nova — Project Context

## Project Identity

Public Name: DevPostify

Development Name: DevPostify Nova

Tagline: Where Developers Build Their Identity.

DevPostify is a developer-first professional social platform where developers can:

- Share technical knowledge
- Showcase projects and expertise
- Build a professional developer identity
- Discover useful technical content
- Save valuable posts

Product direction:

Modern, premium, professional, developer-first, and SaaS-like.

It must NOT feel like a generic social-media clone.

---

# Core Development Rules

- Build DevPostify Nova completely from scratch.
- Old DevPostify is reference-only and must never become a dependency.
- Do not blindly copy the old project.
- V1 scope is locked.
- Do not add features outside V1.
- Avoid unnecessary over-engineering.
- Prefer practical production-grade solutions.
- Do not ask about minor implementation decisions.
- Make sensible technical decisions and continue.
- Verify important work before moving forward.
- Prioritize implementation over excessive discussion.
- Keep code clean, maintainable, reusable, and understandable.
- Never silently change a locked decision.

Development workflow:

PLAN
↓
EXECUTE
↓
VERIFY
↓
TEST
↓
COMMIT
↓
PUSH
↓
NEXT

---

# V1 Scope — LOCKED

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

# Explicitly NOT in V1

- Chat
- AI
- Communities
- GitHub Sync
- Notifications
- Voice
- Video
- Realtime features

---

# Design System — LOCKED

Primary:
#2563EB

Accent:
#7C3AED

Gradient:
Blue → Violet

Theme:

- Dark mode by default
- Light mode supported

Typography:

- Poppins — headings
- Inter — body
- JetBrains Mono — code

Spacing:

8px system

Radius:

- Cards: 16px
- Buttons: 12px
- Inputs: 12px

Accessibility:

- Semantic HTML
- Keyboard-friendly interactions
- Visible focus states
- Accessible forms
- Sufficient color contrast
- Responsive layouts
- Loading/empty/error states

---

# Branding

Provided logo is the visual branding reference.

Branding is recreated as scalable SVG assets.

Current assets:

- frontend/public/brand/devpostify-mark.svg
- frontend/public/brand/devpostify-logo.svg

Symbol-only mark is used as favicon.

---

# Technology Stack — LOCKED

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

Frontend:
Vercel

Backend:
Render

---

# Architecture — LOCKED

Frontend
↓
HTTPS REST API
↓
Express Backend
↓
MongoDB Atlas

The frontend must NEVER connect directly to MongoDB.

Frontend and backend are separate applications.

---

# Repository

Repository:

DevPostify-Nova

Fresh Git repository.

Old DevPostify Git history is not reused.

Structure:

```text
DevPostify-Nova/
├── frontend/
├── backend/
├── README.md
├── .gitignore
└── DEVPOSTIFY_NOVA_CONTEXT.md
```
