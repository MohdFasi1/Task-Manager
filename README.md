
# Task Management Web Application with AI Powered Task Scheduler

Task Management Web App is a full-stack application designed to help users organize and manage tasks efficiently. It features an AI-powered scheduler that automatically prioritizes and arranges tasks based on time and importance, reducing the burden of manual planning and improving productivity.


## Demo

You can try the live version of the app here: <a href="https://task-manager-ten-psi-12.vercel.app/">Task Manager Demo</a>

## Features

- AI-Powered Task Scheduling
- Task Creation and Management
- Appointment Scheduling and Management
- User Authentication & Secure Access
- Real-time Updates


## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

`CLERK_SECRET_KEY`

You can get your Clerk API Keys from the <a href="https://dashboard.clerk.com/">Clerk Dashboard</a>


`MONGODB_URI`

`GOOGLE_API_KEY`

## Installation

Clone the repository:

```bash
git clone https://github.com/MohdFasi1/Task-Manager.git

```

Navigate to the project directory:

```bash
cd Task-Manager

```

Install dependencies:

```bash
npm install

```

Create a .env.local file in the root directory and add your MongoDB connection string and other environment variables:

```bash
MONGODB_URI=your-mongodb-uri
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
GOOGLE_API_KEY=your-google-gemini-api-key

```


Run:

```bash
npm run dev

```
## Technologies Used

**Frontend:** Next.js, TailwindCSS,lucide-react

**Backend:** Node.js, Next/server

**Database:** MongoDB

**Authentication:** Clerk

**AI Model:** Google gemini-2.5-flash
