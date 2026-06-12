# My Game Library

A web application that allows users to manage their personal video game library. Users can track games they have played, rate them, update their status, and search for new games using the RAWG API.

## Features (Currently Implemented)

- User registration & login with JWT authentication
- Protected routes using JSON Web Tokens
- Database models for users, games, and user-game relationships
- Full CRUD for personal game library (add, view, update status/rating, delete)
- React frontend with protected routing and persistent login (localStorage)

## Technologies Used

### Backend
- Python + Flask
- SQLAlchemy with SQLite (for development)
- Flask-Bcrypt (password hashing)
- Flask-JWT-Extended (authentication)
- Flask-CORS

### Frontend
- React + Vite
- Axios
- React Router
- Context API (auth state)


## Phase 1 — Database Models (Completed)

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
- `user_id` (FK → User.id)
- `game_id` (FK → Game.id)
- `status` (e.g., "playing", "completed", "want_to_play")
- `rating`

## Phase 2 — Authentication (Completed)

### Endpoints
- `POST /auth/register` — register a new user (password hashed with Bcrypt)
- `POST /auth/login` — verify credentials and return a JWT access token
- `GET /auth/me` — protected, returns current user's info (requires `Authorization: Bearer <token>`)

### Authentication Flow
- User registers with email & password
- Password is hashed with Bcrypt before saving
- On login, credentials are verified and a JWT access token is issued
- The token is sent with `Authorization: Bearer <token>` to access protected routes

## Phase 3 — Library Endpoints (Completed)

All routes under `/library` are protected with `@jwt_required()`.

- `GET /library` — returns all games in the current user's library
- `POST /library` — adds a game to the library (creates the game record if it doesn't exist yet)
- `PATCH /library/<game_id>` — updates `status` and/or `rating` for a library entry
- `DELETE /library/<game_id>` — removes a game from the library

## Phase 4 — React Frontend (In Progress)

### Completed
- Project scaffolded with Vite, React Router, and Axios
- `AuthContext` for global auth state (token stored in localStorage)
- Axios instance with automatic JWT header injection
- Login page connected to `/auth/login`
- Protected routing (`PrivateRoute`) and Navbar

### In Progress / Planned
- My Library page (display + filter by status)
- Search Games page (RAWG API integration)
- Game Detail page (add to library)

