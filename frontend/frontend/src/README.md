# CRM Lead Management System

## Project Overview

This is a simple full-stack CRM Lead Management System built for a small sales team.  
The system allows users to log in, manage sales leads, update lead status, add lead notes, search/filter leads, and view dashboard statistics.

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- SQLite

## Features Implemented

- User login authentication
- Protected CRM pages
- Create leads
- View all leads
- Edit leads
- Delete leads
- Update lead status
- View lead details
- Add notes to leads
- Dashboard summary
- Search leads by name, company, or email
- Filter leads by status, source, and salesperson



## Setup Instructions
### Backend

cd backend
npm install
npm run dev

### Frontend
cd frontend/frontend
npm install
npm run dev

## Test Login Credentials

Email:
admin@example.com

Password:
password123

## Database Setup

This project uses SQLite.

Database is automatically created when backend starts.

File location:
backend/crm.db

## Reflection

This project helped me understand full-stack development.
I learned how to build a React frontend, create backend APIs using Express, connect a SQLite database, and implement authentication using JWT. I also improved my debugging skills and understood how frontend and backend communicate.

## Environment Variables

Create a `.env` file inside the backend folder:

PORT=5000  
JWT_SECRET=my_crm_secret_key

## Known Limitations

- Only one test user is available  
- No user registration system  
- No role-based access control  
- Basic validation only  
- Designed for local development only  

## Demo Video

```bash 
https://drive.google.com/file/d/1wj_6WgWOhsuFEw_hmPvBUjZ_gtdzws89/view?usp=drive_link
