# DevPostify Nova

> **Where Developers Build Their Identity.**

DevPostify Nova is a developer-first professional publishing platform built for software engineers to share technical knowledge, explain system architectures, showcase implementations, and build a professional engineering identity — without the noise of generic social media.

It was built from scratch with a production-oriented architecture, secure authentication, structured content rendering, developer-focused UX, and a fully deployed REST API.

---

## 🚀 Live Project

| Service            | Link                                                |
| ------------------ | --------------------------------------------------- |
| **Production App** | https://dev-postify-nova.vercel.app                 |
| **REST API**       | https://devpostify-nova-api.onrender.com            |
| **API Health**     | https://devpostify-nova-api.onrender.com/api/health |

---

## ✨ V1 Features

### 🔐 Authentication

- User registration and login
- Login using email or username
- JWT-based authentication
- HTTP-only secure cookies
- Protected routes
- Session termination
- Author ownership validation

### 📝 Technical Publishing

- Create, edit, and delete posts
- GitHub-Flavored Markdown (GFM)
- Live write/preview editor
- Syntax-highlighted code blocks
- Copy-to-clipboard code actions
- Reading-time information
- Engineering-focused categories
- Author ownership checks

### 👤 Developer Profiles

- Public developer profiles
- Editable name and bio
- Published post listings
- Developer-focused profile presentation

### 🔎 Discovery

- MongoDB full-text search
- Category filtering
- Sanitized search input
- Paginated feed results

### 🔖 Bookmarks

- Save technical posts
- Remove bookmarks
- Dedicated bookmarks page
- Duplicate-safe bookmark handling

### ⚙️ Settings

- Developer dark mode
- Account credentials overview
- Authenticated session termination

### ♿ UX & Accessibility

- Responsive desktop/mobile layouts
- Off-canvas mobile navigation
- Loading and skeleton states
- Empty states
- Error states
- Form validation
- Semantic HTML landmarks
- Keyboard-friendly interactions
- Accessible navigation patterns

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│      Next.js Frontend        │
│       App Router + React     │
│                              │
│          Vercel              │
└──────────────┬───────────────┘
               │
               │ HTTPS REST API
               │ credentials: include
               ▼
┌──────────────────────────────┐
│      Express REST API        │
│      Node.js + TypeScript    │
│                              │
│           Render             │
└──────────────┬───────────────┘
               │
               │ Mongoose ODM
               ▼
┌──────────────────────────────┐
│        MongoDB Atlas         │
│                              │
│ Users · Posts · Bookmarks    │
└──────────────────────────────┘
The frontend and backend are intentionally decoupled.
The frontend communicates with the backend exclusively through REST APIs. The backend is responsible for authentication, authorization, validation, business logic, and database access.
The frontend never connects directly to MongoDB.

🛠️ Tech Stack

Frontend : 

Next.js App Router
React 19
TypeScript (Strict)
Tailwind CSS
Lucide React
React Markdown
Remark GFM
Prism.js

Backend : 

Node.js
Express
TypeScript
JSON Web Tokens (JWT)
Cookie Parser
Zod
Mongoose
Database & Infrastructure
MongoDB Atlas

Deployment : 

Vercel
Render

🔒 Engineering & Security

DevPostify Nova was designed with production-oriented security and maintainability in mind.
Authentication
Authentication uses stateless JWT sessions stored in HTTP-only cookies.
Production cookies use:
HttpOnly
Secure
SameSite=None
Path=/
The Express server also explicitly trusts the required reverse-proxy hop for production cookie handling.
Authorization
Protected operations verify the authenticated user before modifying resources.

Users can only:

Edit their own posts
Delete their own posts
Modify their own profile
Manage their own bookmarks
Input Validation
Frontend validation is aligned with backend Zod schemas for important user-facing constraints.

Examples include:

8+ character passwords
Alphanumeric usernames
160-character post titles
Locked engineering categories
Bounded search input
Search Security
Search input is length-bounded and safely escaped before being used in regular-expression based search paths, reducing exposure to regex-based denial-of-service patterns.
Markdown Rendering
Markdown is rendered through an AST-based React Markdown pipeline with GFM support.
Raw HTML execution is not enabled, and code blocks are processed through Prism.js for syntax highlighting.

📁 Project Structure

DevPostify-Nova/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   └── lib/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── utils/
│   └── package.json
│
├── README.md
├── .gitignore
└── DEVPOSTIFY_NOVA_CONTEXT.md
🔌 REST API

Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
Posts
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id
Profiles
GET   /api/profile/:username
PATCH /api/profile
Bookmarks
GET    /api/bookmarks
POST   /api/bookmarks/:postId
DELETE /api/bookmarks/:postId
Discovery
GET /api/search
Health
GET /api/health

⚙️ Local Development

1. Clone the repository

git clone https://github.com/OmBaisane/DevPostify-Nova.git
cd DevPostify-Nova

2. Configure the backend

cd backend
npm install
Create a .env file using the project's environment example and provide:
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:3000

Then start the backend:

npm run dev

3. Configure the frontend

Open another terminal:

cd frontend
npm install
Create the frontend environment file:

NEXT_PUBLIC_API_URL=http://localhost:5000/api

Then start the frontend:

npm run dev
Open: http://localhost:3000

🧪 Production Verification

Build the backend:
cd backend
npm run build

Build the frontend:

cd ../frontend
npm run build
Before deployment, verify:
Authentication flows
Protected routes
Post CRUD
Markdown rendering
Code highlighting
Search and filtering
Bookmarks
Profile editing
Settings/session termination
Responsive navigation
Loading, empty, and error states

🎯 V1 Scope

DevPostify Nova V1 is intentionally focused on the core developer publishing experience.

The following features are not part of V1:

Chat
AI features
Communities
GitHub synchronization
Notifications
Voice/video
Realtime features

Keeping these outside V1 allowed the core platform architecture and user experience to remain focused and maintainable.

🔮 Future Direction

Potential post-V1 features include:

Comments and nested discussions
Technical reactions/upvotes
Following/follower relationships
In-app notifications
GitHub OAuth and repository cards
Developer portfolio/project showcases
Advanced developer discovery
Richer code-sharing experiences
These are intentionally deferred from the current V1 release.

📌 Engineering Highlights

Some of the main engineering decisions behind the project:

Decoupled Next.js + Express architecture
REST-based frontend/backend communication
MongoDB full-text search indexing
JWT authentication with HTTP-only cookies
Backend authorization and ownership checks
Zod-based server validation
AST-based Markdown rendering
Prism.js syntax highlighting
Responsive mobile navigation
Semantic HTML and accessibility considerations
Production deployment across Vercel and Render
TypeScript strict mode across the application

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Built by Om Baisane as a full-stack engineering project focused on developer experience, production-oriented architecture, and practical software engineering.

DevPostify — Where Developers Build Their Identity

```
