# DevPostify Nova — Project Context

## Product

Public Name: DevPostify

Development Name: DevPostify Nova

Tagline: Where Developers Build Their Identity.

DevPostify is a developer-first professional social platform where developers can share technical knowledge, showcase projects and expertise, discover useful technical content, save valuable posts, and build a professional developer identity.

The product should feel modern, premium, professional, developer-first, and SaaS-like — not like a generic social-media clone.

---

# Locked Product Scope

## V1 Features

### Landing

- Landing page

### Authentication

- Register
- Login
- Logout
- JWT authentication
- Protected routes

### Posts

- Feed
- Create post
- View post details
- Edit own post
- Delete own post
- Markdown support
- Code highlighting
- Categories

### Profile

- View profile
- Edit profile
- My posts

### Discovery

- Search
- Category filtering

### Bookmarks

- Bookmark post
- Remove bookmark
- View bookmarks

### Settings

- Dark mode by default
- Light mode
- Account settings

### UX

- Responsive design
- Loading/skeleton states
- Empty states
- Error states
- Form validation
- Toast/success feedback
- Accessible interactions

---

# Explicitly Out of V1

- Chat
- AI
- Communities
- GitHub Sync
- Notifications
- Voice
- Video
- Realtime features

Do not add features outside V1 without an explicit product decision.

---

# Locked Design System

## Colors

Primary:
#2563EB

Accent:
#7C3AED

Gradient:
Blue → Violet

Dark mode is the default.

Light mode is supported.

## Typography

Headings:
Poppins

Body:
Inter

Code:
JetBrains Mono

## Layout

Spacing:
8px system

Cards:
16px radius

Buttons:
12px radius

Inputs:
12px radius

Maximum content width:
1280px

## Accessibility

- Visible focus states
- Keyboard-friendly interactions
- Semantic HTML
- Accessible form controls
- Sufficient color contrast
- Responsive layouts
- Loading, empty, and error states

---

# Branding

Provided logo image is the visual reference.

Branding should be recreated as clean scalable SVG assets.

Current assets:

- `frontend/public/brand/devpostify-mark.svg`
- `frontend/public/brand/devpostify-logo.svg`

The symbol-only mark is used as the favicon.

The UI wordmark should remain flexible and use the product typography system where appropriate.

---

# Locked Technology Stack

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

# Architecture

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

# Repository Structure

```text
DevPostify-Nova/
├── frontend/
├── backend/
├── README.md
├── .gitignore
└── DEVPOSTIFY_NOVA_CONTEXT.md
```
