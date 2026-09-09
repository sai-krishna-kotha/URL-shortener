# URL Shortener API

A production-quality URL shortener built with FastAPI, PostgreSQL, and Redis.

## Architecture Overview

The system follows a layered architecture to ensure separation of concerns and testability:
- **API Layer**: FastAPI routers and Pydantic validation.
- **Service Layer**: Business logic (e.g., short-code generation, collision retries, rate limiting, cache orchestration).
- **Repository Layer**: Database access using SQLAlchemy 2.0 with asyncpg.
- **Data Layer**: PostgreSQL as the source of truth, Redis as a caching layer and rate limiter.

## Key Features

1. **Short URL Generation**: Base62 encoded 7-character strings.
2. **Custom Aliases**: Allows user-defined human-readable aliases.
3. **Expiration**: URLs can be created with an optional expiration date.
4. **Caching & Redirection (Cache-Aside)**: 
   - Uses `redis-py` asyncio client.
   - Redirect endpoint `GET /{short_code}` issues a 307 Temporary Redirect.
   - If a URL is missing from the cache, the API falls back to PostgreSQL, caching the valid result with a dynamic TTL.
5. **Rate Limiting**: 
   - Uses a fixed-window counter in Redis (`rate_limit:create_url:{ip}`).
   - Limits clients to 10 URL creations per minute.
   - **Fail-open behavior**: If Redis is unavailable, the API logs the connection failure but continues to process the URL creation to maintain high availability.
6. **Analytics**:
   - Every redirect atomically increments a click counter in PostgreSQL.
   - `GET /api/v1/urls/{short_code}/stats` returns lifecycle and click statistics. (Note: Currently public as no authentication system exists yet).

## Performance and Tradeoffs
- **Redis for Rate Limiting**: Redis operates entirely in RAM and provides atomic `INCR` and `EXPIRE` operations. It avoids taxing PostgreSQL for transient state like rate limiting.
- **Fixed-Window Limiting**: We chose a fixed window for extreme simplicity. The tradeoff is that a malicious user could theoretically burst 20 requests across the window boundary (10 at 0:59, 10 at 1:00). At higher scale, a Sliding Window Log or Token Bucket would be more strictly accurate.
- **Click Analytics**: We use an atomic `UPDATE urls SET clicks = clicks + 1` counter. This prevents race conditions while remaining lightweight. At massive scale (millions of concurrent clicks), this would bottleneck the DB lock queue, and we would migrate to Redis-buffered asynchronous batch updates or Kafka event streams.
- **Fail-open Limiter**: Dropping legitimate core business traffic just because a defensive cache node crashed violates reliability principles. The system fails open on the rate limiter to guarantee API availability.

## Running Locally

Requirements: Docker & Docker Compose

```bash
docker-compose up -d --build
```

The API will be available at `http://localhost:8000`.

## API Endpoints

### `POST /api/v1/urls`
Creates a shortened URL. Rate limited to 10 requests/minute.
```json
{
  "target_url": "https://example.com"
}
```

### `GET /{short_code}`
Redirects the user to the target URL and increments clicks.

### `GET /api/v1/urls/{short_code}/stats`
Returns JSON statistics for a given short code.
