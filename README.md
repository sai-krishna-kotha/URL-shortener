# URL Shortener

A production-quality URL shortener built with FastAPI, PostgreSQL, Redis, and React. 
This project is fully dockerized and ready for local release.

## 1. Project Overview
This is a URL shortener that takes long URLs and generates a clean, readable 7-character short code. It also tracks the number of times each link is clicked and provides analytics.

## 2. Features
- **Short URL Generation**: Base62 encoded 7-character strings.
- **Custom Aliases**: Allows user-defined human-readable aliases.
- **Expiration**: URLs can be created with an optional expiration date.
- **Caching & Redirection (Cache-Aside)**: High performance redirection backed by Redis.
- **Rate Limiting**: Protects against rapid URL generation spam (Fixed-Window).
- **Click Analytics**: Atomically increments clicks per redirect.
- **Full SPA Frontend**: Built with React, Vite, and Tailwind CSS.
- **Full Dockerization**: Simple one-command start.

## 3. Architecture
- **PostgreSQL**: The absolute source of truth. Handles data consistency and atomic click incrementation.
- **Redis**: Caching and Rate Limiting infrastructure layer. Follows the Cache-Aside pattern. If Redis crashes, the application fails-open to Postgres.
- **FastAPI Backend**: Built using a layered architecture: Router -> Service -> Repository.
- **React Frontend**: Communicates with the backend REST API via standard HTTP calls.

## 4. Tech Stack
- **Backend**: Python, FastAPI, Pydantic, SQLAlchemy 2.0 (async), asyncpg, Alembic.
- **Frontend**: React, Vite, Tailwind CSS (v4), React Router, Lucide React.
- **Infrastructure**: Docker, Docker Compose, Nginx.
- **Databases**: PostgreSQL 15, Redis 7.

## 5. Folder Structure
```
.
├── app/                  # FastAPI Application
│   ├── api/              # Routers (shorten, redirect, analytics)
│   ├── core/             # Configuration, Rate Limiting, Exceptions
│   ├── db/               # PostgreSQL & Redis connections
│   ├── models/           # SQLAlchemy Models
│   ├── repository/       # Database interaction logic
│   ├── schemas/          # Pydantic validation schemas
│   ├── services/         # Core business logic
│   └── utils/            # Base62 encoder
├── frontend/             # React SPA
│   ├── src/              # React Components, Pages, and Services
│   ├── Dockerfile        # Multi-stage frontend Dockerfile
│   └── nginx.conf        # Nginx SPA fallback configuration
├── migrations/           # Alembic Database Migrations
├── tests/                # Pytest Backend Tests
├── docker-compose.yml    # Full stack Docker orchestration
└── Dockerfile            # Backend Dockerfile
```

## 6. Docker Setup
This project runs entirely inside Docker.
```bash
# Clone the repository
git clone https://github.com/sai-krishna-kotha/URL-shortener.git
cd URL-shortener

# Copy the environment file
cp .env.example .env

# Build and start the complete stack (PostgreSQL, Redis, Migrate, API, Frontend)
docker compose up -d --build
```

The services will be available at:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`

## 7. Environment Variables
Local development uses `.env.example` defaults:
```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url_shortener
POSTGRES_SERVER=postgres
POSTGRES_PORT=5432

# Redis
REDIS_URL=redis://redis:6379/0

# App Settings
PROJECT_NAME="URL Shortener API"
API_V1_STR="/api/v1"
DOMAIN="http://localhost:8000"

# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8000
```

## 8. Database Migrations
Migrations are handled automatically by the `migrate` container inside `docker-compose.yml`. On startup, it runs `alembic upgrade head` and ensures the database is fully structured before the API boots.

## 9. API Endpoints

### `POST /api/v1/urls`
Creates a shortened URL. Rate limited to 10 requests/minute.
```json
// Request
{
  "target_url": "https://example.com",
  "custom_alias": "my-alias", // Optional
  "expires_at": "2026-10-10T12:00:00Z" // Optional
}

// Response (201 Created)
{
  "id": 1,
  "short_code": "my-alias",
  "target_url": "https://example.com",
  "short_url": "http://localhost:8000/my-alias",
  ...
}
```

### `GET /{short_code}`
Redirects the user to the target URL (307 Temporary Redirect) and increments clicks.

### `GET /api/v1/urls/{short_code}/stats`
Returns JSON lifecycle statistics for a given short code.
```json
// Response (200 OK)
{
  "short_code": "my-alias",
  "clicks": 42,
  "is_active": true,
  ...
}
```

### `GET /health`
Returns `{"status": "ok"}`. Used by Docker healthchecks.

## 10. Frontend Setup
The frontend is built automatically inside Docker and served by Nginx on Port 3000. It utilizes `VITE_API_BASE_URL` mapped to `http://localhost:8000`.

## 11. Testing
Backend tests can be run inside the API container:
```bash
docker compose exec -e PYTHONPATH=/app api pytest tests/
```

## 12. Redis Cache Strategy
The system uses the **Cache-Aside** pattern.
1. `GET /{short_code}` checks Redis.
2. If cache hits, redirect immediately.
3. If cache misses, fetch from PostgreSQL.
4. Cache the result in Redis with a dynamic TTL (up to 24 hours, or until URL expiration) and redirect.

## 13. Rate Limiting
A Fixed-Window rate limiter is implemented in Redis (`rate_limit:create_url:{ip}`).
- Allows 10 requests per 60 seconds per IP.
- **Fail-Open**: If Redis crashes, the limiter logs a warning but allows requests to proceed to ensure system availability.

## 14. Click Tracking
Every time a URL is redirected, the click count is atomically incremented in PostgreSQL via `UPDATE urls SET clicks = clicks + 1`. This guarantees correct counts under concurrent load.

## 15. Error/Status Codes
- `201 Created`: URL successfully shortened.
- `307 Temporary Redirect`: Successful redirection.
- `400 Bad Request`: Invalid URL format or alias format.
- `404 Not Found`: Short code does not exist.
- `409 Conflict`: Custom alias is already taken.
- `410 Gone`: URL has expired or been deactivated.
- `429 Too Many Requests`: Rate limit exceeded.

## 16. Example Requests
**Create URL using cURL:**
```bash
curl -X POST http://localhost:8000/api/v1/urls \
     -H "Content-Type: application/json" \
     -d '{"target_url": "https://google.com"}'
```

**Check Stats:**
```bash
curl http://localhost:8000/api/v1/urls/{short_code}/stats
```

## 17. Known Limitations
- The Analytics endpoint is completely public.
- The Rate Limiter uses a basic Fixed-Window, which is susceptible to burst traffic at window edges.
- Click counting is synchronous and synchronous row-level locking in PostgreSQL will eventually bottleneck at extremely high scale (10k+ clicks/sec on a single link).

## 18. Future Improvements
- **Authentication**: Add JWT-based user accounts and private analytics.
- **Asynchronous Click Buffering**: Move click counting to an asynchronous worker (e.g. Celery + Redis buffering) to eliminate database write contention at high scale.
- **Sliding Window Rate Limiter**: Upgrade to a token bucket or sliding log for more precise abuse prevention.
