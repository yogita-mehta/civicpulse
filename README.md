# CivicPulse - Citizen Grievance Management System(Ongoing)

CivicPulse is a modern web application that enables citizens to submit grievances and complaints to government departments. Department officers can manage, track, and resolve complaints efficiently, while admins can monitor and assign complaints. The system also supports feedback from citizens after resolution.

---

## Features

### Citizen Portal
- Register and log in as a citizen
- Submit complaints with title, description, location, and optional images
- Track the status of submitted complaints
- Provide feedback and rating after resolution

### Department Portal
- View complaints assigned to the department
- Mark complaints as resolved with optional resolution notes
- Access detailed complaint information including images
- Track complaints by status: Assigned, In Progress, Resolved

### Admin Portal
- View all complaints across all departments
- Assign complaints to appropriate departments or officers
- Monitor complaint statuses: Pending, Assigned, In Progress, Resolved

---

## Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS, Vite  
- **Backend:** Spring Boot, Java  
- **Database:** MySQL / PostgreSQL (configurable)  
- **Authentication:** JWT / Session-based  
- **File Storage:** Local folder or OneDrive for uploaded images

---

## Setup Instructions

### Backend
1. Open the `backend` folder in your IDE.
2. Configure `application.properties` with your database credentials.
3. Ensure the upload folder exists (e.g., `C:/yogita-backend/uploads`).
4. Run the Spring Boot application.

### Frontend
1. Open the `frontend` folder.
2. Install dependencies:

```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Access the app in your browser:
```bash
http://localhost:5173

```

### Usage

1. Register as a citizen and log in.

2. Submit a grievance with details and optional images.

3. Admin assigns the complaint to the appropriate department.
   
4. Department officers view and resolve complaints.

5. Citizens can provide feedback after a complaint is resolved.

### Folder Structure
```bash
yogita/
├── backend/          # Backend server code (e.g., API, database logic)
├── ygt/              # Frontend application (React/Vue/HTML/CSS/JS)
└── ygt_backup/       # Backup/snapshots of frontend code
```
###  Notes

- Ensure proper CORS and resource handler configuration in Spring Boot for image access.

- All uploaded images are stored in the uploads folder for consistency.

- Feedback can only be submitted after a complaint is marked as resolved.
