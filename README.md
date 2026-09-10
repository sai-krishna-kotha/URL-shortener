# URL Shortener

A production-oriented URL shortener built with FastAPI, PostgreSQL, Redis, and React. The application supports short URL generation, custom aliases, optional expiration, click analytics, Redis caching, rate limiting, Dockerized local development, and public deployment.

## Live Demo

- Frontend: https://url-shortener-121.up.railway.app/
- Short-link / API domain: https://short-link-e.up.railway.app
- API documentation: https://short-link-e.up.railway.app/docs

The frontend and API run as separate services in the same Railway project. Generated short links use the dedicated short-link domain, for example `https://short-link-e.up.railway.app/hiii`, while the React frontend remains available at its own URL.

## Project Overview

The application accepts a long HTTP or HTTPS URL and generates a unique 7-character Base62 short code. Users can optionally provide a custom alias or an expiration timestamp. Each redirect increments the click count, while Redis improves redirect performance through cache-aside caching.

## Features

- Short URL generation using random 7-character Base62 codes
- Custom aliases with validation and uniqueness enforcement
- Optional URL expiration
- Redirect handling with Redis cache-aside strategy
- PostgreSQL as the source of truth
- Atomic click tracking in PostgreSQL
- Redis fixed-window rate limiting for URL creation
- Public analytics endpoint for URL statistics
- React SPA with responsive UI
- Docker Compose setup for PostgreSQL, Redis, migrations, API, and frontend
- Alembic database migrations
- Automated backend test suite
- Railway deployment for the frontend and API

## Architecture

```text
                         +-------------------+
                         |     React SPA      |
                         |   Nginx / Vite     |
                         +---------+---------+
                                   |
                                   | REST API
                                   v
                         +-------------------+
                         |      FastAPI       |
                         |       Router       |
                         +---------+---------+
                                   |
                                   v
                         +-------------------+
                         |     URLService     |
                         |   Business Logic   |
                         +---------+---------+
                                   |
                                   v
                         +-------------------+
                         |   URLRepository    |
                         |  Data Access Layer |
                         +---------+---------+
                                   |
                                   v
                         +-------------------+
                         |    PostgreSQL      |
                         |   Source of Truth  |
                         +-------------------+

                 Redis is used independently for:
                 - Redirect caching
                 - Rate limiting
```

### Redirect Flow

```text
GET /{short_code}
      |
      v
Check Redis
      |
   +--+--+
   |     |
  Hit   Miss
   |     |
   |     v
   |  PostgreSQL
   |     |
   |  Cache result
   |     |
   +-----+
      |
      v
Redirect to target URL
      |
      v
Atomic click increment
```

## Design Decisions

### PostgreSQL as the source of truth

URL records, lifecycle information, and click counts are persisted in PostgreSQL. Redis is treated as an infrastructure layer rather than the authoritative datastore.

### Cache-aside caching

For redirects, the application first checks Redis. A cache miss queries PostgreSQL and then populates Redis with the URL data. Cached entries use a bounded TTL and respect URL expiration.

If Redis becomes unavailable, redirect requests fall back to PostgreSQL so that caching infrastructure failure does not make stored URLs unusable.

### Atomic click tracking

Click counts are incremented using an atomic SQL update:

```sql
UPDATE urls
SET clicks = clicks + 1
WHERE id = :id;
```

This avoids a read-modify-write race between concurrent redirect requests.

### Short code generation

The service generates a random 7-character Base62 code using Python's `secrets` module. A database uniqueness constraint protects against collisions, and the service retries generation when necessary.

### Rate limiting

URL creation is protected by a Redis fixed-window limiter allowing 10 requests per minute per client IP. The limiter fails open when Redis is unavailable so that Redis failure does not block the core URL creation path.

## Technology Stack

### Backend

- Python
- FastAPI
- Pydantic v2
- SQLAlchemy 2.0 Async
- asyncpg
- Alembic

### Frontend

- React
- Vite
- Tailwind CSS v4
- React Router
- Lucide React

### Infrastructure

- PostgreSQL
- Redis
- Docker
- Docker Compose
- Nginx
- Railway

### Testing

- pytest
- pytest-asyncio
- HTTPX

## Project Structure

```text
.
├── app/
│   ├── api/              # FastAPI routers
│   ├── core/             # Configuration, rate limiting, exceptions
│   ├── db/               # PostgreSQL and Redis connections
│   ├── models/           # SQLAlchemy models
│   ├── repository/       # Database access layer
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   └── utils/            # Utility functions such as Base62 generation
├── frontend/
│   ├── src/              # React components, pages, services, utilities
│   ├── Dockerfile        # Multi-stage frontend Dockerfile
│   └── nginx.conf        # Nginx SPA configuration
├── migrations/           # Alembic migrations
├── tests/                # Backend tests
├── docker-compose.yml    # Full local stack
├── Dockerfile            # Backend image
├── .env.example          # Example environment variables
└── README.md
```

## Running Locally with Docker

Clone the repository and start the full stack:

```bash
git clone https://github.com/sai-krishna-kotha/URL-shortener.git
cd URL-shortener
cp .env.example .env
docker compose up -d --build
```

The services are available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Swagger UI: http://localhost:8000/docs

The Compose setup starts PostgreSQL and Redis, runs Alembic migrations, and then starts the API and frontend services.

## Environment Variables

Example local configuration:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=url_shortener
POSTGRES_SERVER=postgres
POSTGRES_PORT=5432

REDIS_URL=redis://redis:6379/0

PROJECT_NAME="URL Shortener API"
API_V1_STR="/api/v1"
DOMAIN="http://localhost:8000"

VITE_API_BASE_URL=http://localhost:8000
```

For production, `DOMAIN` and `VITE_API_BASE_URL` should point to the deployed API/short-link domain instead of localhost.

## Database Migrations

Database schema changes are managed using Alembic.

The Docker Compose `migrate` service runs:

```bash
alembic upgrade head
```

before the API starts.

For local manual migration execution:

```bash
docker compose run --rm migrate alembic upgrade head
```

## API Endpoints

### Create a Short URL

```http
POST /api/v1/urls
```

Request:

```json
{
  "target_url": "https://example.com",
  "custom_alias": "example",
  "expires_at": "2026-10-10T12:00:00Z"
}
```

`custom_alias` and `expires_at` are optional.

Response:

```json
{
  "id": 1,
  "short_code": "example",
  "target_url": "https://example.com",
  "created_at": "2026-09-10T00:32:52.414992Z",
  "expires_at": null,
  "clicks": 0,
  "is_active": true,
  "short_url": "https://short-link-e.up.railway.app/example"
}
```

### Redirect

```http
GET /{short_code}
```

Returns a `307 Temporary Redirect` to the original target URL and increments the click count.

### URL Statistics

```http
GET /api/v1/urls/{short_code}/stats
```

Returns lifecycle information and the current click count.

### Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

## Example Requests

Create a short URL:

```bash
curl -X POST https://short-link-e.up.railway.app/api/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"target_url":"https://www.google.com"}'
```

Redirect using the returned short code:

```bash
curl -i https://short-link-e.up.railway.app/{short_code}
```

Check statistics:

```bash
curl https://short-link-e.up.railway.app/api/v1/urls/{short_code}/stats
```

## Validation and Limits

- Only HTTP and HTTPS target URLs are accepted.
- Target URLs are limited to 2048 characters.
- Custom aliases are 3 to 30 characters.
- Custom aliases use alphanumeric characters, `_`, and `-`.
- URL creation is limited to 10 requests per minute per client IP.
- Expired or inactive URLs return `410 Gone`.

## Error Codes

| Status | Meaning |
| --- | --- |
| 201 | URL created successfully |
| 307 | Redirect to the target URL |
| 400 | Invalid URL or alias |
| 404 | Short code not found |
| 409 | Custom alias already exists |
| 410 | URL expired or inactive |
| 422 | Request validation failed |
| 429 | Rate limit exceeded |
| 500 | Internal short-code generation failure |

## Testing

Run the backend test suite inside Docker:

```bash
docker compose exec -e PYTHONPATH=/app api pytest tests/
```

The project has automated tests covering repository behavior, API behavior, validation, and application flows.

## Deployment

The project is deployed using Railway with separate public services for the backend API and React frontend within the same Railway project.

Production services:

```text
Frontend -> https://url-shortener-121.up.railway.app/
Short-link / API -> https://short-link-e.up.railway.app
Swagger -> https://short-link-e.up.railway.app/docs
```

The dedicated short-link domain is used both for generated short URLs and API requests. The frontend is built as a static React application and served by Nginx. The API runs with FastAPI and Uvicorn. PostgreSQL and Redis provide the backend persistence and infrastructure layers.

## Known Limitations

- The analytics endpoint is currently public and does not require authentication.
- The fixed-window rate limiter can allow bursts around window boundaries.
- Click counting is performed synchronously in PostgreSQL, which can become a bottleneck for very high traffic to a single short URL.
- Redis is used for caching and rate limiting; PostgreSQL remains the source of truth.

## Future Improvements

- Add authentication and user-owned URLs.
- Protect analytics with authorization.
- Add link management operations such as update, deactivate, and delete.
- Introduce asynchronous click-event processing for higher-scale workloads.
- Replace fixed-window rate limiting with token-bucket or sliding-window limiting.
- Add richer analytics such as time-series clicks, referrers, and device information.
- Add custom domains for generated short URLs.

## Repository

GitHub: https://github.com/sai-krishna-kotha/URL-shortener
