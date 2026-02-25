🚀 TINCLO — Job Swipe Platform

TINCLO is a modern job discovery platform inspired by Naukri.com + Tinder swipe experience.
It allows users to discover jobs through an intuitive swipe interface and create smart matches between candidates and opportunities.

✨ Key Features

🔥 Tinder-style job swiping UI

👤 User ↔ Job matching system

📦 MERN stack architecture

⚡ Fast React + Vite frontend

🗄️ MongoDB Atlas integration

🧪 Seed script for sample jobs

🔍 RESTful API design

❤️ Match tracking & apply status

🏗️ Tech Stack

Frontend

React

Vite

JavaScript

ESLint

Backend

Node.js

Express.js

MongoDB + Mongoose

dotenv

📁 Project Structure
TINCLO/
├── client/              # React + Vite frontend
├── server/              # Express backend
│   ├── models/
│   │   ├── Job.js
│   │   └── Match.js
│   ├── routes/
│   │   ├── jobs.js
│   │   └── matches.js
│   ├── scripts/
│   │   └── seedJobs.js
│   ├── .env
│   └── server.js
└── README.md

⚙️ Getting Started
1️⃣ Clone the Repository
git clone <your-repo-url>
cd TINCLO

🖥️ Frontend Setup (React + Vite)
cd client
npm install
npm run dev


Frontend will run on:

http://localhost:5173

🧠 Backend Setup (Express + MongoDB)
Install Dependencies
cd server
npm install

🔐 Environment Variables

Create a .env file inside the server folder:

cp .env.example .env


Update with your MongoDB Atlas URI:

MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173

🌱 Seed Sample Jobs (Optional)
npm run seed

▶️ Run Backend
Development
npm run dev

Production
npm start


Server runs on:

http://localhost:5000

🔌 API Endpoints
🧑‍💼 Jobs

GET /api/jobs — Get all jobs

GET /api/jobs/:id — Get single job

POST /api/jobs — Create new job

DELETE /api/jobs/:id — Delete job

❤️ Matches

GET /api/matches/user/:userId — Get user's matches

POST /api/matches — Create match

PUT /api/matches/:id/apply — Mark as applied

DELETE /api/matches/:id — Delete match

🩺 Health Check

GET /api/health — Server status

🧪 Testing with Postman
Get All Jobs
GET http://localhost:5000/api/jobs

Create Match
POST http://localhost:5000/api/matches
Content-Type: application/json

{
  "userId": "user123",
  "jobId": "PASTE_JOB_ID_HERE"
}

Get User Matches
GET http://localhost:5000/api/matches/user/user123

Mark as Applied
PUT http://localhost:5000/api/matches/MATCH_ID_HERE/apply

🧩 Development Notes

Models are located in server/models/

Routes are in server/routes/

Seed script: server/scripts/seedJobs.js

Uses Mongoose for schema modeling

Supports MongoDB Atlas and local MongoDB

🚀 Future Enhancements (Optional Ideas)