# My Game Library

A web application that allows users to manage their personal video game library. Users can track games they have played, rate them, update their status, search for new games using the RAWG API, and view personal statistics on a dashboard.

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

## Phase 4 — React Frontend (Completed)

### Pages

**Login Page** — email/password form, stores JWT in localStorage via AuthContext, redirects to `/library` on success.

**My Library** (`/library`) — displays all games in your library with cover, name, status, and rating. Filter buttons let you narrow by status (playing, completed, want_to_play, planned, dropped). Remove button deletes a game.

**Search Games** (`/search`) — search form queries the RAWG API through a backend proxy (`/api/games/search?q=...`). Results are displayed as a grid of cards with cover image and release year. Click a card to see details.

**Game Detail** (`/game/:rawg_id`) — fetches full game info from RAWG via backend proxy (`/api/games/:id`). Shows cover, name, release date, rating, genres, platforms, and description. "Add to Library" button adds the game via `POST /library`.

### RAWG API Proxy

Two backend endpoints protect the RAWG API key (set via `RAWG_API_KEY` environment variable):
- `GET /api/games/search?q=<query>` — proxy for RAWG game search
- `GET /api/games/<rawg_id>` — proxy for RAWG game details

## Phase 5 — RAWG API + Stats (Completed)

### Genres & Platforms

- `Game` model now stores `genres` and `platforms` as JSON text columns
- Games added from RAWG include their genres and platform names
- Displayed on library cards and in game detail

### Stats Dashboard (`/dashboard`)

- **`GET /library/stats`** — protected endpoint returning counts grouped by status:
  ```json
  { "total": 10, "playing": 2, "completed": 3, "want_to_play": 1, "planned": 3, "dropped": 1 }
  ```
- Visual cards showing each status count with color coding
- Horizontal bar chart breakdown for quick overview
- Click any status card to navigate to your library

### Backend Changes

- `Game` model: added `genres` (Text) and `platforms` (Text) columns
- `POST /library` now accepts and stores `genres` (array of strings) and `platforms` (array of strings)
- `GET /library` now returns `genres` and `platforms` arrays
- New `GET /library/stats` endpoint for status counts

### Frontend Pages

| Page | What's new |
|---|---|
| **Dashboard** | Status count cards + bar chart breakdown |
| **Search Games** | Genre names shown on result cards |
| **My Library** | Genres and platforms shown per game card |
| **Game Detail** | Genres/platforms sent when adding to library |

### Setup

1. Set your RAWG API key:
   ```bash
   set RAWG_API_KEY=your_key_here
   ```
2. Start the backend:
   ```bash
   cd Backend
   pip install requests
   python app.py
   ```
3. Start the frontend:
   ```bash
   cd library-frontend
   npm install
   npm run dev

