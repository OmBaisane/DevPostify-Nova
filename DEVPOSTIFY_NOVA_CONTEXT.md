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
- Do not over-engineer V1.
- Do not add features outside the locked V1 scope.
- Prefer practical production-ready solutions.
- Keep code clean, maintainable, reusable, and understandable.
- Verify important work before moving forward.
- Avoid unnecessary discussions for normal technical decisions.
- Ask only when a genuinely important product/architecture decision cannot reasonably be determined.
- Implementation takes priority over excessive theory.

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
NEXT

---

# 3. LOCKED V1 FEATURES

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

# 4. EXPLICITLY OUTSIDE V1

Do NOT build these features in V1:

- Chat
- AI
- Communities
- GitHub Sync
- Notifications
- Voice
- Video
- Realtime features

Do not silently expand the V1 scope.

---

# 5. DESIGN SYSTEM

## Colors

Primary:
#2563EB

Accent:
#7C3AED

Gradient:
Blue → Violet

## Theme

- Dark mode is the default.
- Light mode is supported.

## Typography

- Poppins — headings
- Inter — body
- JetBrains Mono — code

## Spacing

8px spacing system.

## Radius

Cards:
16px

Buttons:
12px

Inputs:
12px

## Branding

The provided DevPostify logo reference is the branding source.

Branding assets should be recreated as:

- Clean SVG/vector assets
- Scalable
- Reusable
- Production-ready

Favicon:

- Symbol-only logo mark

---

# 6. TECH STACK

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

- Vercel

Backend:

- Render

Use current stable and compatible versions at setup time.

Avoid unnecessary dependencies.

---

# 7. ARCHITECTURE

One GitHub repository:

DevPostify-Nova/

    frontend/
    backend/
    README.md
    .gitignore
    DEVPOSTIFY_NOVA_CONTEXT.md

Frontend and backend are separate applications.

Architecture:

Frontend
↓
HTTPS REST API
↓
Express Backend
↓
MongoDB Atlas

The frontend must NEVER connect directly to MongoDB.

---

# 8. DATABASE

V1 collections:

- users
- posts
- bookmarks

Database principles:

- Sensible validation
- Proper relationships
- Timestamps
- Useful indexes
- Reasonable query performance
- No unnecessary database complexity

---

# 9. REST API DIRECTION

Authentication:

POST /api/auth/register
POST /api/auth/login

Posts:

GET /api/posts
GET /api/posts/:id
POST /api/posts
PATCH /api/posts/:id
DELETE /api/posts/:id

Profile:

GET /api/profile/:username
PATCH /api/profile

Bookmarks:

GET /api/bookmarks
POST /api/bookmarks/:postId
DELETE /api/bookmarks/:postId

API rules:

- REST architecture
- Consistent success/error responses
- Authentication where required
- Ownership authorization for user-owned resources
- Validate request input
- Validate MongoDB IDs
- Avoid unnecessary API complexity

---

# 10. PROJECT STRUCTURE

## Frontend

Next.js App Router with a practical feature-oriented structure.

## Backend

Express backend with clear separation between:

- Routes
- Validation
- Controllers
- Services when genuinely useful
- Models
- Middleware
- Utilities
- Configuration

Do not introduce unnecessary abstraction.

---

# 11. CURRENT DEVELOPMENT STATUS

## Milestone 1 — Project Setup

Status:
COMPLETE

Completed:

- Fresh DevPostify Nova project initialized
- Frontend initialized
- Backend initialized
- Git repository configured
- GitHub remote configured
- Initial project pushed to GitHub
- Basic development environment verified

Environment versions used during setup:

- Node.js: v22.17.0
- npm: v10.9.2
- Git: 2.54.0.windows.1

---

# 12. MILESTONE 2 — DESIGN / SYSTEM FOUNDATION

Status:
COMPLETE

Completed:

- Design direction established
- Branding direction established
- Dark-first theme direction
- Typography system
- Color system
- Spacing system
- Radius system
- Responsive/accessibility principles
- UI foundation

---

# 13. MILESTONE 3 — BACKEND FOUNDATION

Status:
COMPLETE

Completed:

- Express backend foundation
- TypeScript backend setup
- Environment configuration
- MongoDB connection
- Application/server separation
- Middleware foundation
- Error handling foundation
- API structure
- Mongoose foundation

---

# 14. MILESTONE 4 — DATABASE / MONGOOSE FOUNDATION

Status:
COMPLETE

Completed:

- MongoDB Atlas integration
- Mongoose configuration
- User model foundation
- Post model foundation
- Bookmark model foundation
- Schema validation foundations
- Timestamps and relationships
- Relevant database structure

Important model correction completed:

- `auther` was corrected to `author` in the Post model.

---

# 15. MILESTONE 5 — AUTHENTICATION

Status:
COMPLETE

Implemented and verified:

- User registration
- User login
- User logout
- Password hashing
- JWT generation
- JWT verification
- HTTP-only authentication cookie
- Authentication middleware
- Protected routes
- Authenticated user identification
- `GET /api/auth/me`
- Request typing for authenticated user ID
- Authentication validation/error handling

Authentication is considered complete.

Do not rebuild Milestone 5 unless a later feature exposes a real defect.

---

# 16. MILESTONE 6 — POSTS SYSTEM

Status:
COMPLETE

Posts API is fully implemented and pushed to GitHub.

## Create Post

Implemented:

POST /api/posts

Supports:

- title
- content
- category
- tags
- optional cover image URL
- authenticated author assignment
- request validation

Status:
COMPLETE

## Feed

Implemented:

GET /api/posts

Supports:

- Public feed
- Pagination
- Newest-first ordering
- Post retrieval
- Pagination metadata

Status:
COMPLETE

## Single Post

Implemented:

GET /api/posts/:id

Supports:

- Public access
- MongoDB ObjectId validation
- Post lookup
- Author population
- 400 for invalid ID
- 404 for missing post

Status:
COMPLETE

## Edit Own Post

Implemented:

PATCH /api/posts/:id

Supports:

- Authentication
- ObjectId validation
- Partial updates
- Request validation
- Ownership authorization
- 403 when another user attempts editing
- 404 for missing post

Status:
COMPLETE

## Delete Own Post

Implemented:

DELETE /api/posts/:id

Supports:

- Authentication
- ObjectId validation
- Ownership authorization
- 403 for unauthorized owner mismatch
- 404 for missing post
- Successful deletion response

Status:
COMPLETE

## Posts Verification

Verified:

- TypeScript type-check
- Backend production build
- Development server
- Successful API requests
- Authentication protection
- Validation/error cases
- Ownership authorization

Git checkpoint:

- Posts System committed
- Changes pushed to GitHub

Milestone 6 is CLOSED.

---

# 17. CURRENT ACTIVE MILESTONE

## Milestone 7 — Profile System

Status:
NEXT

The next implementation phase is the Profile System.

Planned API direction:

GET /api/profile/:username
PATCH /api/profile

Expected scope:

- View public profile
- Username
- Name
- Bio
- Avatar
- Relevant profile information
- My posts
- Edit own profile
- Authentication/ownership protection
- Validation
- Error handling

Do not add social/follow functionality unless it is explicitly part of the locked V1 implementation plan.

---

# 18. UPCOMING MILESTONES

After Profile System:

## Milestone 8

Bookmarks System

Expected:

- Bookmark post
- Remove bookmark
- View bookmarks
- Prevent duplicate bookmarks
- Proper ownership/authentication

## Milestone 9

Search + Category Filtering

Expected:

- Search posts
- Category filtering
- Query validation
- Pagination compatibility
- Reasonable database querying/indexing

## Milestone 10

Frontend App Shell

Expected:

- Global layout
- Navigation
- Theme system
- Responsive shell
- Reusable UI foundation

## Milestone 11

Frontend Authentication

Expected:

- Register UI
- Login UI
- Logout
- Auth state
- Protected frontend routes
- Form validation
- Loading/error/success UX

## Milestone 12

Feed + Post UI

Expected:

- Feed
- Post cards
- Create post
- Markdown editor/rendering
- Code highlighting
- Post detail
- Edit/delete UX
- Loading/empty/error states

## Milestone 13

Profile UI

Expected:

- Public profile
- Profile editing
- My posts
- Responsive states

## Milestone 14

Search + Bookmarks UI

Expected:

- Search
- Category filters
- Bookmark actions
- Bookmarks page
- Loading/empty/error states

## Milestone 15

Settings + Themes

Expected:

- Account settings
- Dark/light theme
- Accessible theme controls
- Responsive settings UI

## Milestone 16

Full Frontend ↔ Backend Integration

Expected:

- End-to-end API integration
- Authenticated flows
- Error handling
- Consistent API client behavior
- Production-ready state handling

## Milestone 17

Testing + Security

Expected:

- API testing
- Validation testing
- Authorization testing
- Authentication testing
- Security review
- Edge cases

## Milestone 18

Performance + Product Polish

Expected:

- Performance review
- Query optimization
- Loading/skeleton polish
- Accessibility review
- Responsive review
- UX consistency

## Milestone 19

Deployment

Expected:

- Backend deployment to Render
- Frontend deployment to Vercel
- Production environment variables
- CORS configuration
- MongoDB production configuration
- Cloudinary configuration
- Production verification

## Milestone 20

README + Portfolio Polish

Expected:

- Professional README
- Architecture documentation
- Feature documentation
- Setup instructions
- Deployment information
- Screenshots/demo
- Portfolio presentation
- Final project review

---

# 19. GIT RULES

Repository:

DevPostify-Nova

This is a fresh repository.

Do not reuse old DevPostify Git history or remote.

Before important checkpoints verify:

git status
git remote -v

Also verify:

- type-check
- build
- tests where applicable

Use meaningful milestone commits.

Completed major checkpoint:

Milestone 6 — Posts System pushed successfully.

---

# 20. CONTINUITY RULES

This file is the project source of truth.

At meaningful milestones update:

- Locked decisions
- Current milestone
- Completed work
- Current task
- Next task
- Important technical decisions
- Known issues

Do NOT store:

- Temporary debugging conversations
- Repeated test credentials
- Minor command history
- Resolved one-off errors
- Unnecessary implementation chatter

If a locked decision changes, explicitly document the change.

Never silently change locked product decisions.

---

# 21. CURRENT SOURCE-OF-TRUTH SNAPSHOT

Current state:

Milestones 1–6:
COMPLETE

## Current Milestone

Milestone 7 — Profile System

Status: COMPLETE

### Completed

- Public profile API
- User posts included in profile response
- Edit own profile API
- Profile validation
- Authentication protection
- Profile ownership protection
- Username/email cannot be changed through profile endpoint
- Password excluded from profile responses
- Profile API error handling
- API testing completed
- Type-check passed
- Production build passed

### Milestone 8: Bookmarks System (COMPLETE)

- `POST /api/bookmarks/:postId` — Add post to bookmarks (prevents duplicate via code & compound index)
- `DELETE /api/bookmarks/:postId` — Remove bookmark
- `GET /api/bookmarks` — List user's bookmarks with populated post and author info
- Auth middleware convention: `requireAuth`
- Type-check and build verified

### Milestone 9: Discovery (Search & Category Filtering) (COMPLETE)

- Added weighted full-text search index on `Post` schema (`title: 10`, `tags: 5`, `content: 1`)
- Upgraded `GET /api/posts` to handle:
  - Full-text search queries sorted by `$meta: "textScore"` relevance
  - Category-based lowercase filtering
  - Sanitized pagination parameters
- Verification: Type-check and production build passed

### Next Milestone

Current Task: Milestone 10 — Frontend Foundation & Design System Setup

Current immediate objective:

Build and verify the Profile API before moving to Bookmarks.

Project philosophy:

Learn → Practice → Build → Verify → Ship

The goal is a production-quality flagship portfolio project, not merely a tutorial project.
