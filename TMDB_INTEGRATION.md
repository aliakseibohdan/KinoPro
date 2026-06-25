# TMDB Integration Guide

## Setup Instructions

### 1. Get TMDB API Key
1. Go to https://www.themoviedb.org/settings/api
2. Sign up or log in
3. Create an API key
4. Copy the API key

### 2. Configure Backend

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Update `.env` file** with your TMDB API key:
   ```env
   TMDB_API_KEY=your_api_key_here
   TMDB_BASE_URL=https://api.themoviedb.org/3
   PORT=5000
   NODE_ENV=development
   ```

3. **Start backend:**
   ```bash
   npm run dev
   ```

### 3. Configure Frontend

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Popular Movies
- **GET** `/api/movies/popular?page=1`
- Returns list of popular movies

### Search Movies
- **GET** `/api/movies/search?q=query_string`
- Search for movies by title

### Movie Details
- **GET** `/api/movies/:id`
- Get detailed information about a specific movie

### Recommendations
- **GET** `/api/movies/:id/recommendations?page=1`
- Get movie recommendations based on a specific movie

### Genres List
- **GET** `/api/movies/genres/list`
- Get all available movie genres

### Movies by Genre
- **GET** `/api/movies/genre/:genreId?page=1`
- Get movies filtered by genre

## Usage Example in Frontend

```typescript
import { fetchPopularMovies, searchMovies, getMovieDetails } from '@/lib/tmdbApi';

// Fetch popular movies
const popular = await fetchPopularMovies(1);

// Search movies
const results = await searchMovies('Inception');

// Get movie details
const details = await getMovieDetails(550);
```

## File Structure

```
backend/
├── src/
│   ├── index.ts (main server file)
│   ├── services/
│   │   └── tmdbService.ts (TMDB API client)
│   └── routes/
│       └── movies.ts (API routes)
├── .env
└── package.json

frontend/
├── lib/
│   └── tmdbApi.ts (Frontend API client)
├── .env.local
└── package.json
```

## Notes

- All responses are in Russian language (`language: 'ru-RU'`)
- The backend acts as a proxy to TMDB API
- Error handling is implemented for all endpoints
- CORS is enabled for development