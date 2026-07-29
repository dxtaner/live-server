# 🎥 Live Server & Media Streaming Platform

A modern **full-stack live streaming platform** built with **Node.js**, featuring **RTMP**, **HTTP-FLV**, and a responsive web interface for creators and viewers.

The platform enables users to register, authenticate, broadcast live video, and watch streams with **low-latency playback** using **FLV.js**.

---

# ✨ Features

- 🔐 Secure User Authentication (Register & Login)
- 📡 RTMP Live Broadcasting
- 📺 Low-Latency HTTP-FLV Video Streaming
- 🎥 Live Stream Management Dashboard
- 👤 Creator Broadcast Panel
- 📊 Stream Monitoring
- ⚡ Fast Node.js Backend
- 🎨 Responsive User Interface
- 🔒 Environment Variable Support
- 🚀 Easy Deployment & Development Setup

---

# 📁 Project Structure

```text
LIVE-SERVER/
│
├── 📁 media-server/
│   └── 📄 mediaServer.js
│
├── 📁 public/
│   ├── 📄 index.html
│   ├── 📄 login.html
│   ├── 📄 register.html
│   ├── 📄 dashboard.html
│   ├── 📄 go-live.html
│   ├── 📄 stream.html
│   ├── 📄 app.js
│   ├── 📄 flv.min.js
│   └── 🎨 style.css
│
├── 📁 src/
│
├── ⚙️ .env
├── 📦 package.json
├── 🔒 package-lock.json
└── 📘 README.md
```

---

# 📂 Folder Overview

### 📁 media-server

Contains the streaming engine responsible for:

- RTMP Server
- HTTP-FLV Server
- Stream Routing
- Stream Configuration

---

### 📁 public

Client-side application files.

| File           | Description            |
| -------------- | ---------------------- |
| index.html     | Landing page           |
| login.html     | User login             |
| register.html  | User registration      |
| dashboard.html | Stream dashboard       |
| go-live.html   | Start broadcasting     |
| stream.html    | Live stream player     |
| app.js         | Client-side JavaScript |
| flv.min.js     | FLV Player             |
| style.css      | Application styles     |

---

### 📁 src

Backend business logic.

Typical contents include:

- Authentication
- API Controllers
- Database Services
- Middleware
- Stream APIs

---

# 🚀 Technology Stack

### Backend

- Node.js
- Express.js
- Node Media Server
- RTMP
- HTTP-FLV

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)

### Streaming

- FLV.js
- RTMP
- HTTP-FLV

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/dxtaner/live-server

cd LIVE-SERVER
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
# Application Port
PORT=3000

# Media Streaming Port
MEDIA_PORT=1935

# Environment
NODE_ENV=development

# MongoDB (Optional)
# DB_URI=mongodb://localhost:27017/live-server
```

---

# ▶️ Running the Project

## Development Mode

```bash
npm run dev
```

---

## Production Mode

```bash
npm start
```

---

## Start Media Server Only

```bash
node media-server/mediaServer.js
```

---

# 🌐 Access the Application

After the server starts, open:

| Service       | URL                                  |
| ------------- | ------------------------------------ |
| Home          | http://localhost:3000                |
| Register      | http://localhost:3000/register.html  |
| Login         | http://localhost:3000/login.html     |
| Dashboard     | http://localhost:3000/dashboard.html |
| Go Live       | http://localhost:3000/go-live.html   |
| Stream Player | http://localhost:3000/stream.html    |

---

# 📺 User Workflow

### 👤 1. Create an Account

Register a new account using the registration page.

↓

### 🔐 2. Login

Authenticate with your credentials.

↓

### 🎥 3. Start Broadcasting

Navigate to **Go Live** and begin your live stream.

↓

### 📡 4. Media Server

The RTMP server receives the stream and converts it to HTTP-FLV.

↓

### 📺 5. Watch Live

Open the Stream page to watch broadcasts with ultra-low latency.

---

# 📄 License

This project is available under the MIT License.

---

# 👨‍💻 Author

**Taner Özer**

Software Developer

📧 Email: tanerozer16@gmail.com

🌐 GitHub: https://github.com/dxtaner

⭐ If you like this project, don't forget to give it a star!
