module.exports = {
  apps: [
    {
      name: "backend",
      script: "server.js",
      env: {
        PORT: 5000,
        JWT_SECRET: "supersecret123",   // пример, подставь свой
        TMDB_API_KEY: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYzE3OGFmZTQyNGU4NDNjYWY0NzEyMzkzMzkxODMxMSIsIm5iZiI6MTc4MDA2MjM0Ni43ODQsInN1YiI6IjZhMTk5ODhhMzBkMDNlNjUwNmJhYjZiNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.t0N8JPoBTNQeHjR9u2W2c5ZoKA5jWs5reZicos2gKy8"
      }
    }
  ]
};
