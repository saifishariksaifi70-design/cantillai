# Cantill.ai – AI-Powered Procurement Management System

## About Project

Cantill.ai ek AI-powered procurement management system hai jo companies ke purchase requests ko manage aur process karne mein help karta hai.

Is project mein employees AI Chat ya CSV upload ke through purchase requests create kar sakte hain. System active procurement policy ke according requests evaluate karta hai aur decide karta hai ki request ka Purchase Order automatically create hoga, sourcing mein jayegi ya admin approval ki zarurat hogi.

## Main Features

### Employee Panel
- Employee Registration and Login
- Employee Dashboard
- AI Chat for creating purchase requests
- My Requests – apni purchase requests dekhna
- My Orders – apne purchase orders dekhna

### Admin Panel
- Admin Dashboard with request statistics
- All Purchase Requests
- Approve or Reject Requests
- Purchase Order Management
- Sourcing Request Management
- Procurement Policy Management
- Procurement Decisions
- CSV File Upload and Processing

### Backend Features
- JWT Authentication
- Role-Based Access Control
- REST APIs
- MongoDB Database
- AI-Based Purchase Details Extraction
- Policy-Based Request Evaluation
- Automatic Purchase Order Creation
- CSV Processing

## Technologies Used

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React
- React Hot Toast

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer
- Google GenAI

## Project Structure

```text
Cantill.ai/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       └── utils/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── README.md
├── APPROACH.md
└── DECISIONS.md
```

## Installation and Setup

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Cantill.ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file and add the required MongoDB connection string, JWT secret, Gemini API key and other configuration variables used by the backend.

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## API Routes

| Module | Endpoint |
|---|---|
| Auth | `/api/auth` |
| Policies | `/api/policies` |
| AI Chat | `/api/chat` |
| Requests | `/api/requests` |
| CSV Upload | `/api/csv` |

## Future Improvements

- Advanced procurement policy evaluation
- Supplier and contract matching
- Purchase request consolidation
- Detailed audit logs
- Advanced reporting and analytics
- Improved policy amendment workflow

## Developer

Sharik Saifi

MERN Stack Developer
