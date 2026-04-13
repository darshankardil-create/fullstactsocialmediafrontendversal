# 🚀 Full Stack Social Media – Frontend

# 🌐 Live Website :
# https://fullstactsocialmediafrontendversal.vercel.app

A high-performance **social media frontend application** that delivers real-time interactions, optimized rendering, and a modern UI/UX experience.

This project is built with a strong focus on **scalability, performance, and clean architecture**, making it production-ready.

---

## 🌐 Live Backend

```txt
https://full-stack-socialmedia-backend-gw3c.onrender.com
```

---

## ⚙️ Tech Stack

* Next.js/React (App router) 
* Material UI
* Socket-based real-time communication
* Cloud-based media storage
* Toast notification system

---

## 🧠 Core Architecture Overview

This frontend follows a **component-driven architecture** with a modern routing system.

### 🔄 Data Flow

```txt
User Action
   ↓
UI Components
   ↓
API Calls (**Fetch** – Authentication & Data Fetching)
   ↓
Backend (Authentication Service + Data Service)
   ↓
Real-Time Events (create post, like, unlike, comment)
   ↓
State Update → UI Re-render
```

---

## 📂 Project Structure

```bash
.
├── app
│   ├── components
│   │   ├── shared-theme
│   │   │   └── ThemeProvider.jsx
│   │   ├── CommentSection.jsx
│   │   ├── header.jsx
│   │   ├── PostBody.jsx
│   │   ├── PostForm.jsx
│   │   ├── SignIn.js
│   │   └── ViewProfile.jsx
│   ├── login
│   ├── Signup
│   ├── baseUrl.js
│   ├── globals.css
│   ├── layout.tsx
│   └── page.jsx
└── next.config.ts
```

---

## 🔥 Features

### 🔐 Authentication

* Delete account,Login & Signup system
* Token-based authentication
* Token stored in `localStorage`

---

### 📝 Post System

* Create posts (text + media) using **real-time emitters**
* Media upload handling
* Draft persistence using `localStorage`

---

### 💬 Real-Time Comments

* Add comments instantly
* No page refresh required

---

### ❤️ Real-Time Like / Unlike

* Instant UI updates
* Synced across all users

---

### ♾️ Feed System (Performance Highlight)

* **Infinite Scroll** → Loads posts continuously as user scrolls
* **Fetch-on-Scroll** → Data is fetched only when needed
* **Virtualization** → Only visible items are rendered

✅ Result:

* Smooth scrolling
* No lag with large datasets
* Optimized memory usage

---

### 🎨 UI/UX

* Fully responsive design ✅
* Light / Dark mode
* Clean and modular layout

---

## 🔌 API & Real-Time Integration

```js
const baseurl = "https://full-stack-socialmedia-backend-gw3c.onrender.com";
```

---

## 🔐 Authentication APIs

### Login

```js
POST /express/login
```

**Purpose:** Authenticate user and return token

---

### Signup

```js
POST /express/signup
```

**Purpose:** Register new user

---

### Delete account

```js
DELETE /express/deleteac
```

**Purpose:** Delete user account from userinfos collection

---

## 📝 Post System

### Create Post (Real-Time)

```js
socket.emit("create_post", { postData });
```

**Purpose:**

* Create post instantly
* Broadcast to all users

---

### Get All Posts

```js
GET /express/getpost
```

**Purpose:** Fetch posts (**used in Infinite Scroll + Fetch-on-Scroll**)

---

### Get My Posts

```js
GET /express/getonlymypost/:username
```

**Purpose:** Fetch user's posts

---

## 💬 Comment System

### Add Comment (Real-Time)

```js
socket.emit("add_comment", { postId, commentData });
```

**Purpose:**

* Add comment instantly
* Broadcast update

---

### Get Comments

```js
GET /express/getcomments/:postId
```

**Purpose:** Fetch existing comments

---

## ❤️ Like System

### Like Post (Real-Time)

```js
socket.emit("like_post", { postId, userId });
```

**Purpose:**

* Add like
* Sync UI instantly

---

### Unlike Post (Real-Time)

```js
socket.emit("unlike_post", { postId, userId });
```

**Purpose:**

* Remove like
* Sync UI instantly

---

## 👤 User API

### Get User Profile

```js
GET /express/getuser/:username
```

**Purpose:** Fetch user details

---

## 🔄 Real-Time Flow

```txt
User Action (Create Post / Like / Comment / Unlike)
   ↓
emit event
   ↓
Server processes event
   ↓
Broadcast to all users
   ↓
UI updates instantly
```

---

## 🚀 Getting Started

### Clone

```bash
git clone <repo-url>
cd <project-folder>
```

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

### Open

```txt
http://localhost:3000
```

---

## 📌 Key Engineering Decisions

* Real-time updates using event-based communication
* Efficient rendering using **Virtualization**
* Optimized loading using **Fetch-on-Scroll**
* Seamless UX with **Infinite Scroll**
* Local storage used for persistence

---

## ⭐ Why This Project Stands Out

* Real-time interaction system (including post creation)
* Strong performance optimizations (**Virtualization + Fetch-on-Scroll**)
* Clean and scalable architecture
* Production-ready frontend

---

## 👨‍💻 Author

**Darshan Kardile**
