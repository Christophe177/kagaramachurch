# Church Management System (CMS)

A comprehensive digital platform for Kagarama Church to manage members, events, families, baptism/kwakirwa, marriage, prayer requests, and appointments.

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Auth**: JWT + Bcrypt (Custom Implementation)
- **UI**: Custom CSS design system (Blue/Navy + Gold/Blue accents)

## Getting Started

### 1. Setup MySQL Database

1. Open your MySQL tool (e.g., XAMPP phpMyAdmin, MySQL Workbench)
2. Run the SQL in `mysql_schema.sql` to create the `church_cms` database and tables.

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=church_cms
JWT_SECRET=your_random_secret_here
```

### 3. Install & Run

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start both (in separate terminals)
# Server
cd server && npm run dev

# Client
cd client && npm run dev
```

Open `http://localhost:5173` in your browser.

## User Roles

| Role | Dashboard | Capabilities |
|------|-----------|-------------|
| Pastor | `/pastor` | Manage members, review prayer requests, baptism/marriage management, appointments |
| Manager | `/manager` | Events, announcements, families, photo of the day, deletion requests |
| Member | `/member` | Join church, baptism/kwakirwa, marriage, prayer requests, appointments |

## Project Structure

```
├── client/           # React frontend
│   └── src/
│       ├── assets/   # Photos & Logo
│       ├── pages/    # Page components
│       ├── layouts/  # Site layouts
│       └── services/ # REST API layer
├── server/           # Express backend
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth + role checking
│   └── config/       # DB connection
└── mysql_schema.sql  # MySQL Database script
```
