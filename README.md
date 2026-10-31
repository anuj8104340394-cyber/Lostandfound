# 🎓 Campus Lost & Found Web Portal

> **A resilient full-stack MERN application powered by Multi-Cloud Services (XaaS: DBaaS, Storage aaS, PaaS, Security aaS).**

[![Node.js](https://img.shields.io/badge/Node.js-v24.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple.svg)](https://vitejs.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-DBaaS-brightgreen.svg)](https://www.mongodb.com/cloud/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage%20aaS-blueviolet.svg)](https://cloudinary.com/)
[![Render](https://img.shields.io/badge/Render-PaaS-black.svg)](https://render.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()

---

## 🌐 Live Deployments

- 🚀 **Live Backend API:** [https://lostandfound-opy1.onrender.com](https://lostandfound-opy1.onrender.com)
- 🩺 **API Health Check:** [https://lostandfound-opy1.onrender.com/api/health](https://lostandfound-opy1.onrender.com/api/health)
- 💻 **Live Frontend Portal:** Deployable on Render Static Site (`dist/`)
- 📂 **GitHub Repository:** [https://github.com/anuj8104340394-cyber/Lostandfound](https://github.com/anuj8104340394-cyber/Lostandfound)

---

## 📌 Project Overview

Misplacing personal belongings on a university campus—such as ID cards, wallets, keys, electronics, and books—is a recurring problem. Traditional approaches like physical notice boards or unstructured chat groups lack searchability, status tracking, and authentication.

This project delivers a **centralized, secure, and responsive web portal** where campus members can report lost or found items, filter through active records in real time, view high-resolution photos, and coordinate item recovery directly with the reporter.

---

## ☁️ Cloud Architecture & XaaS Mapping

This system is architected around modern cloud computing delivery models (**Anything as a Service**):

```
                                 +---------------------+
                                 |   Client Browsers   |
                                 +----------+----------+
                                            |
                                            v
                     +----------------------------------------------+
                     |    Cloudflare & App Security (Security aaS)  |
                     |  - Edge SSL/TLS HTTPS Encryption             |
                     |  - DDoS Shield & Dual-Tier Rate Limiting     |
                     +----------------------+-----------------------+
                                            |
                     +----------------------+-----------------------+
                     |                                              |
                     v                                              v
      +-----------------------------+                +-----------------------------+
      |  Render Static Site (PaaS)  |                |  Render Web Service (PaaS)  |
      |  - React 18 + Vite Frontend |                |  - Node.js 24 + Express API |
      |  - Client-side Routing      |                |  - Business Logic & Auth    |
      +-----------------------------+                +--------------+--------------+
                                                                    |
                                   +--------------------------------+--------------------+
                                   |                                                     |
                                   v                                                     v
                    +-----------------------------+                       +-----------------------------+
                    |    MongoDB Atlas (DBaaS)    |                       |   Cloudinary (Storage aaS)  |
                    |  - 3-Node Managed Cluster   |                       |  - Media Storage Bucket     |
                    |  - Auto-failover & Backups  |                       |  - Auto 800px & WebP/AVIF   |
                    +-----------------------------+                       +-----------------------------+
```

| Cloud Model | Provider / Tech | Role in Project |
| :--- | :--- | :--- |
| **DBaaS** *(Database as a Service)* | **MongoDB Atlas** | Hosted NoSQL cluster (3-node replica set) storing items, users, and audit timestamps. |
| **Storage aaS** *(Storage as a Service)* | **Cloudinary** | Offloads binary image storage, applies auto-compression, and delivers assets via global CDN. |
| **PaaS** *(Platform as a Service)* | **Render (Backend)** | Executes Node.js API runtime with automatic git deploys and health monitoring. |
| **PaaS** *(Platform as a Service)* | **Render (Frontend)** | Builds and hosts the React/Vite single-page application at the network edge. |
| **Security aaS** *(Security as a Service)* | **Cloudflare / Helmet** | Full HTTPS termination, DDoS defense, HTTP security headers, and brute-force rate limiters. |

---

## ✨ Features

- **🔍 Multi-Criteria Search & Filter Engine:**
  - Real-time search across titles, descriptions, and campus locations.
  - Dropdown filters by **Type** (`Lost`, `Found`) and **Category** (`Phone`, `Wallet`, `ID Card`, `Bag`, `Keys`, `Books`, `Other`).
  - Exact calendar date filtering and a "Clear Filters" reset button.
- **🏷️ Color-Coded Badges:** Red badges for **Lost** items, Green badges for **Found** items, and Grey badges for **Claimed** items.
- **🔄 Status Lifecycle (Open vs. Claimed):** Resolved items are hidden by default to keep the feed actionable; a toggle reveals claimed items.
- **📸 Cloudinary Image Optimization:** Uploaded images are automatically scaled to a max bounding box of 800x800px with AI quality compression and next-gen format conversion (`WebP`/`AVIF`).
- **🔐 JWT Authentication & Ownership Protection (RBAC):**
  - Public can browse all items and view contact details freely.
  - Only authenticated users can report items.
  - **Only the post creator** can edit, delete, or mark an item as Claimed/Returned.
- **🛡️ Defense-in-Depth Security:**
  - Strict Rate Limiter on `/api/auth` (**10 attempts / 15 mins**) to block password guessing.
  - Loose Rate Limiter on general routes (**300 requests / 15 mins**).
  - Multer MIME-type filter rejecting non-image files with a 5 MB payload ceiling.
  - `helmet` HTTP hardening and origin-restricted `cors`.
- **🚀 Developer & Operational Enhancements:**
  - Production health check endpoint (`GET /api/health`) reporting system uptime and database connection status.
  - Campus-themed **404 Page Not Found** component.
  - **Protected Route** wrappers with automatic redirection back to the intended URL upon login.
  - Bottom-right animated **Toast Notification** system.

---

## 📁 Repository Structure

```text
Lostandfound/
├── .gitignore
├── README.md
├── PROJECT_REPORT.md
├── client/                     # Frontend (React 18 + Vite)
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css           # Modern, responsive vanilla CSS
│       ├── context/
│       │   ├── AuthContext.jsx # JWT session persistence
│       │   └── ToastContext.jsx# UI notifications
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── ItemCard.jsx
│       │   └── ProtectedRoute.jsx
│       └── pages/
│           ├── Home.jsx        # Search, filters & card grid
│           ├── ItemDetail.jsx  # Full details & owner controls
│           ├── ReportItem.jsx  # Multipart form + photo preview
│           ├── EditItem.jsx    # Post updater
│           ├── Login.jsx
│           ├── Register.jsx
│           └── NotFound.jsx    # Campus 404 page
└── server/                     # Backend (Node.js + Express)
    ├── .env.example
    ├── package.json
    ├── index.js                # App entry, Helmet, CORS & Rate Limits
    ├── config/
    │   ├── db.js               # MongoDB connection logic
    │   └── cloudinary.js       # Cloudinary SDK setup
    ├── models/
    │   ├── User.js             # User schema with Bcrypt hashing
    │   └── Item.js             # Item schema with Mongoose refs
    ├── middleware/
    │   ├── auth.js             # JWT verification middleware
    │   └── upload.js           # Multer + Cloudinary storage engine
    ├── controllers/
    │   ├── auth.controller.js  # Register, login, getMe
    │   └── item.controller.js  # CRUD operations & claim toggle
    └── routes/
        ├── auth.routes.js
        └── item.routes.js
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1**
- **Vite 5.3.4**
- **React Router DOM 6.25.1**
- **Plain Responsive CSS** (Grid, Flexbox, CSS Variables)

### Backend
- **Node.js 24.x**
- **Express.js 4.19.2**
- **Mongoose 8.5.1** (MongoDB ODM)
- **JSON Web Tokens (`jsonwebtoken` 9.0.2)**
- **Bcrypt.js 2.4.3**
- **Multer 1.4.5-lts.1** & **`multer-storage-cloudinary` 4.0.0**
- **Cloudinary SDK 1.41.3**
- **Helmet 7.1.0**, **CORS 2.8.5**, **`express-rate-limit` 7.3.1**

---

## 💻 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB running on `localhost:27017`)
- A free [Cloudinary](https://cloudinary.com/) account

### 2. Clone the Repository
```bash
git clone https://github.com/anuj8104340394-cyber/Lostandfound.git
cd Lostandfound
```

### 3. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://<username>:<password>@<shard-urls>/campus_lost_found?ssl=true&replicaSet=atlas-r8q3ge-shard-0&authSource=admin&retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev    # with nodemon
# or
npm start      # standard node
```
Verify at `http://localhost:5000/api/health`.

### 4. Frontend Setup
Open a new terminal:
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start Vite dev server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🚀 Production Deployment Guide

### 1. MongoDB Atlas (DBaaS)
1. Create a free **M0 Sandbox cluster** in your nearest region.
2. In **Database Access**, create a user (`anujsin1922_db_user`) with read/write privileges.
3. In **Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) so Render containers can connect.
4. Obtain the replica set connection string and append `/campus_lost_found`.

### 2. Cloudinary (Storage as a Service)
1. Sign up on [Cloudinary](https://cloudinary.com/) and navigate to the Dashboard.
2. Copy your **Cloud Name**, **API Key**, and **API Secret**.
3. Images uploaded via the app will automatically be organized inside the `campus-lost-found` folder.

### 3. Render Backend Deployment (PaaS)
1. In [Render Dashboard](https://dashboard.render.com), select **New +** ➔ **Web Service**.
2. Connect the `Lostandfound` repository:
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`
3. Add the Environment Variables:
   - `MONGODB_URI` = *(Your MongoDB Atlas connection string)*
   - `JWT_SECRET` = *(Strong secret key)*
   - `CLOUDINARY_CLOUD_NAME` = *(Your Cloud Name)*
   - `CLOUDINARY_API_KEY` = *(Your API Key)*
   - `CLOUDINARY_API_SECRET` = *(Your API Secret)*
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `*`
4. Deploy and verify at `https://<YOUR-API-NAME>.onrender.com/api/health`.

### 4. Render Frontend Deployment (PaaS)
1. Select **New +** ➔ **Static Site**.
2. Connect the `Lostandfound` repository:
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
3. Add the Environment Variable:
   - `VITE_API_BASE_URL` = `https://<YOUR-API-NAME>.onrender.com/api`
4. Click **Create Static Site**.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | System uptime & MongoDB connection probe |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT (Rate limited: 10/15min) |
| `GET` | `/api/auth/me` | Private | Get profile for currently authenticated user |
| `GET` | `/api/items` | Public | Query catalog (params: `search, type, category, date, showClaimed`) |
| `GET` | `/api/items/:id` | Public | Get single item with populated reporter info |
| `POST` | `/api/items` | Private | Report new item with Cloudinary image upload |
| `PUT` | `/api/items/:id` | Private (Owner) | Edit item details or replace photo |
| `PATCH` | `/api/items/:id/claim` | Private (Owner) | Toggle item status between Open and Claimed |
| `DELETE`| `/api/items/:id` | Private (Owner) | Delete item and delete image from Cloudinary |

---

## 🧪 Security & Quality Verification

- **Rate Limiting Verification:** Sending 11 consecutive requests to `/api/auth/login` triggers HTTP `429 Too Many Requests` on attempt #10 and #11, defending against credential stuffing.
- **Fail-Safe Fallbacks:** The upload subsystem automatically detects missing Cloudinary credentials in local offline testing and gracefully switches to disk storage (`server/uploads/`).
- **Protected Redirection:** Attempting to access `/report` without an active session automatically redirects to `/login` and navigates back to `/report` upon successful authentication.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
