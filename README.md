# 🌍 Lova AI - AI Website Builder

> An intelligent full-stack web application that generates production-ready websites using AI. Users can create stunning, glassmorphism-styled websites through text prompts or voice input, with support for both HTML and React outputs.

![Next.js](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![AI](https://img.shields.io/badge/AI-Groq-orange)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### Core Functionality
- 🎯 **AI-Powered Generation** - Generate complete websites from text prompts using Groq LLM
- 🎤 **Voice Input** - Convert speech to text using Sarvam AI for hands-free creation
- 🎨 **Glassmorphism Design** - Modern dark-themed UI with glassmorphism aesthetics
- 📱 **Multi-Page Support** - Generates 3 complete pages (Home, About, Contact)
- ⚛️ **React Support** - Option to generate React components or static HTML
- ✏️ **Modification** - Modify existing websites with AI assistance (max 5 modifications/project)

### User Experience
- 🔐 **Authentication** - Firebase Google Sign-In
- 💳 **Payment Integration** - Razorpay for credit purchases
- 📊 **Dashboard** - Manage projects and view credits
- 👁️ **Live Preview** - Real-time website preview with responsive testing
- 📦 **Export** - Download generated code as files

---

## 🛠️ Tech Stack

### Frontend
```
React 18 + Vite
Tailwind CSS 3
Firebase (Authentication)
Lucide React (Icons)
React Router DOM
```

### Backend
```
Node.js + Express
Groq SDK (AI/LLM)
PostgreSQL + pg (Database)
Razorpay (Payments)
Sarvam AI (Speech-to-Text)
```

### Database
```
Neon (PostgreSQL) - Cloud-hosted
```

---

## 📁 Project Structure

```
lovA/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Dashboard, Preview, Billing, etc.
│   │   ├── components/    # Reusable UI components
│   │   ├── firebase.js   # Firebase config
│   │   └── api.js        # API endpoints
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── index.js          # Express server + routes
│   ├── db.js             # PostgreSQL connection
│   ├── prompts.txt       # AI prompts configuration
│   └── .env              # Environment variables
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon or local)
- Groq API key
- Firebase project
- Razorpay merchant account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/lova-ai.git
cd lova-ai
```

2. **Install dependencies**
```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

3. **Environment Setup**

Create `server/.env`:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
GROQ_API_KEY=your_groq_api_key
SARVAM_API_KEY=your_sarvam_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

4. **Database Setup**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  websites INTEGER DEFAULT 1,
  prompts_used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255),
  prompt TEXT,
  website_type VARCHAR(50),
  generated_code TEXT,
  modification_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. **Run the application**
```bash
# Terminal 1 - Backend
cd server && node index.js

# Terminal 2 - Frontend
cd client && npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate website from prompt |
| POST | `/api/modify` | Modify existing website |
| POST | `/api/voice-to-text` | Convert audio to text |
| GET | `/api/projects/:email` | Get user projects |
| POST | `/api/create-user` | Create new user |
| GET | `/api/user/:email` | Get user details |
| POST | `/api/create-order` | Create Razorpay order |
| POST | `/api/verify-payment` | Verify payment |

---

## 🎨 Design System

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0f` | Main background |
| Cyan | `#22d3ee` | Primary accent |
| Violet | `#a855f7` | Secondary accent |
| Rose | `#f43f5e` | Highlight accent |

### Components
- Glassmorphism cards with backdrop blur
- Gradient buttons with glow effects
- Animated gradient orbs for decoration
- Responsive grid layouts
- Smooth transitions and hover effects

---

## 📊 Key Features for Resume

- ✅ Full-stack development (React + Node.js)
- ✅ AI/ML integration (Groq LLM)
- ✅ Cloud database (PostgreSQL/Neon)
- ✅ Payment integration (Razorpay)
- ✅ Voice AI integration (Sarvam)
- ✅ Responsive design (Tailwind CSS)
- ✅ User authentication (Firebase)
- ✅ RESTful API design

---

## 🔧 Future Improvements

- [ ] Add more design templates
- [ ] Implement code optimization
- [ ] Add collaborative features
- [ ] Deploy to Vercel/Netlify

---

## 📝 License

MIT License - feel free to use this project for learning and development.

---

## 👤 Author

**Your Name**
- 🌐 Portfolio: yourportfolio.com
- 💼 LinkedIn: linkedin.com/in/yourprofile
- 🐙 GitHub: github.com/yourusername

---

*Built with ❤️ using React, Node.js, and AI*