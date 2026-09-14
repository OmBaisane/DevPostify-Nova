# DevPostify Nova

> Where Developers Build Their Identity.

DevPostify Nova is a modern, developer-first technical publishing platform built for software engineers to articulate system architectures, share code implementations, and cultivate an engineering identity without generic social media noise.

[![Frontend Deployment](https://img.shields.io/badge/Frontend-Vercel-black?style=flat-square&logo=vercel)](https://dev-postify-nova.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render)](https://devpostify-nova-api.onrender.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)

---

## Live Deployments

- **Production App**: [https://dev-postify-nova.vercel.app](https://dev-postify-nova.vercel.app)
- **REST API Base**: [https://devpostify-nova-api.onrender.com](https://devpostify-nova-api.onrender.com)
- **API Health Check**: [https://devpostify-nova-api.onrender.com/api/health](https://devpostify-nova-api.onrender.com/api/health)

---

## Core Engineering Features (V1 Locked)

- **Developer Dark Mode**: Permanently locked dark slate canvas (`#020617`) with a blue-violet gradient identity system.
- **Safe Markdown & Code Highlighting**: Client-side rendering with GitHub Flavored Markdown (GFM), syntax blocks, copy-to-clipboard actions, and zero raw-HTML execution to mitigate stored XSS.
- **Cross-Domain Session Architecture**: Strict stateless JWT sessions via `HttpOnly`, `SameSite=None`, `Secure` cookies traversing Vercel edge and Render reverse-proxies safely (`trust proxy: 1`).
- **Discovery Engine**: MongoDB text indexing combined with input sanitization to eliminate ReDoS attack vectors.
- **Technical Post Lifecycle**: Full CRUD operations with author-ownership checks, category categorization, and personal bookmarking.
- **Semantic & Accessible UI**: Responsive off-canvas navigation, semantic HTML landmarks (`<main>`, `<article>`, `<header>`, `<nav>`), and keyboard accessibility.

---

## Architectural Topology

````text
Next.js (App Router on Vercel)
        │
        ▼ HTTPS / Cross-Site Credentials (SameSite=None; Secure)
Node.js + Express REST API (Render)
        │
        ▼ Mongoose ODM
MongoDB Atlas Cluster
Tech StackLayerTechnologiesFrontendNext.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, react-markdownBackendNode.js, Express, TypeScript, Zod, JSON Web Tokens (JWT), Cookie-ParserDatabaseMongoDB Atlas, Mongoose ODMHostingVercel (Edge CDN Frontend), Render (Node Runtime Backend)Engineering Decisions & HardeningCross-Origin Cookie Handshake: To prevent session drop across vercel.app and onrender.com, cookies strictly enforce SameSite=None and Secure=true. Reverse proxy forwarding headers are explicitly trusted in Express to prevent handshake drops.Authoritative Backend Validation: Frontend provides instant UI feedback matching backend Zod schemas 1:1 (e.g., minimum 8-character passwords, alphanumeric username constraints, capped search inputs).Safe Markdown Rendering: Fenced code blocks and markdown content avoid direct dangerouslySetInnerHTML usage. Content parsing operates through an AST pipeline preventing arbitrary DOM script execution.Environment Variables ReferenceFrontend (frontend/.env.local)Code snippetNEXT_PUBLIC_API_URL=[https://devpostify-nova-api.onrender.com/api](https://devpostify-nova-api.onrender.com/api)
Backend (backend/.env)Code snippetPORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/devpostify
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=[https://dev-postify-nova.vercel.app](https://dev-postify-nova.vercel.app)
Local DevelopmentBash# 1. Clone repository
git clone [https://github.com/OmBaisane/DevPostify-Nova.git](https://github.com/OmBaisane/DevPostify-Nova.git)
cd DevPostify-Nova

# 2. Setup & run backend
cd backend
npm install
npm run dev

# 3. Setup & run frontend
cd ../frontend
npm install
npm run dev
LicenseDistributed under the MIT License. Built with engineering rigor by Om Baisane.
---

### Step 2: Final Verification Checklist

Terminal me check karo dono apps ka build:

**Backend Build Check:**
   
   ```bash
   cd backend
   npm run build

**Frontend Build Check:**
   
   ```bash
   cd ../frontend
   npm run build

````