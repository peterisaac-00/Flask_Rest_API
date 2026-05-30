My Game Library

A web application that allows users to manage their personal video game library. Users can track games they have played, rate them, update their status, and search for new games using the RAWG API.

# Features (Currently Implemented)

- User management (Registration & Login ready for Phase 2)
- Database models for users, games, and user-game relationships
- Support for game status and rating tracking

# Technologies Used

## Backend
- Python + Flask
- SQLAlchemy with SQLite (for development)
- Flask-Login (UserMixin)
- JWT Authentication (to be implemented in Phase 2)
- Flask-CORS

## Frontend (Planned for Phase 4)
- React + Vite
- Axios
- React Router

#Project Structure
    my-game-library/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── routes/
│   └── requirements.txt
├── frontend/          # To be added in Phase 4
└── README.md



## Phase 1 — Database Models (Completed)

### Current Models:

**User**
- `id`
- `email` (unique)
- `password_hash`

**Game**
- `id`
- `rawg_id` (from RAWG API)
- `name`
- `cover`

**UserGame** (Association Table)
- `user_id`
- `game_id`
- `status` (e.g., "playing", "completed", "want_to_play")
- `rating`

## Phase 2 — Authentication (Completed)

### Features Implemented:
- User registration endpoint (`POST /auth/register`)
- Password hashing using Bcrypt
- User login endpoint (`POST /auth/login`)
- Password verification
- Protected route (`GET /auth/me`)
- Basic authentication flow ready for JWT integration

### Authentication Flow:
- User registers with email & password
- Password is securely hashed before saving
- User logs in with credentials
- Credentials are verified using hashed password
- Authenticated user data can be accessed via protected endpoint

### Future Improvements (Phase 2 Upgrade):
- Add JWT token generation on login
- Add token-based authentication for `/auth/me`
- Add authorization middleware / decorators
- Add refresh token system (optional)

## How to Run (Current Stage)

### 1. Setup Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate        
pip install -r requirements.txt