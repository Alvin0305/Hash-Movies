import axios from "axios";

// Determine the baseURL based on the environment
// import.meta.env.PROD is true when running 'vite build' (production)
// import.meta.env.DEV is true when running 'vite' (development server)
// VITE_API_BASE_URL should be defined in your .env.development (or .env.local) for local dev
const baseURL = import.meta.env.PROD
  ? "/api" // For production builds, requests are relative to the domain serving the app
  : import.meta.env.VITE_API_BASE_URL; // For local development, use the full URL

const API = axios.create({
  baseURL: baseURL,
});

// --- Auth ---
export const register = (userData) => API.post("/auth/register", userData);
export const login = (credentials) => API.post("/auth/login", credentials);

// --- Movies ---
export const fetchMovies = (params = {}) => API.get("/movies", { params });
export const fetchMoviesByGenre = (id) => API.get(`/movies/genre/${id}`);
export const fetchMovieById = (id) => API.get(`/movies/${id}`);
export const createMovie = (movieData) =>
  API.post("/movies", movieData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateMovie = (id, movieData) =>
  API.put(`/movies/${id}`, movieData);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);
export const likeMovie = (id) => API.patch(`/movies/${id}/like`);
export const unlikeMovie = (id) => API.patch(`/movies/${id}/unlike`);

// --- Actors ---
export const fetchActors = () => API.get("/actors");
export const createActor = (actorData) =>
  API.post("/actors", actorData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateActor = (id, actorData) =>
  API.put(`/actors/${id}`, actorData);
export const deleteActor = (id) => API.delete(`/actors/${id}`);

// --- Genres ---
export const fetchGenres = () => API.get("/genres");
export const createGenre = (genreData) =>
  API.post("/genres", genreData, {
    headers: {
      "Content-Type": "multipart/form-data", // Assuming genre creation might involve an image
    },
  });
export const updateGenre = (id, genreData) =>
  API.put(`/genres/${id}`, genreData);
export const deleteGenre = (id) => API.delete(`/genres/${id}`);

// --- Platforms ---
export const fetchPlatforms = () => API.get("/platforms");
export const createPlatform = (platformData) =>
  API.post("/platforms", platformData, {
    headers: {
      "Content-Type": "multipart/form-data", // Assuming platform creation might involve an image/logo
    },
  });
export const updatePlatform = (id, platformData) =>
  API.put(`/platforms/${id}`, platformData);
export const deletePlatform = (id) => API.delete(`/platforms/${id}`);

// --- Reviews ---
export const fetchReviews = () => API.get("/reviews");
export const fetchReviewsByMovie = (id) => API.get(`/reviews/movie/${id}`);
export const createReview = (reviewData) => API.post("/reviews", reviewData);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);
export const updateReview = (id, reviewData) =>
  API.put(`/reviews/${id}`, reviewData);

// --- Users & User Actions (Watchlist, Liked, Viewed) ---
export const fetchWatchList = (id) => API.get(`/users/${id}/watchList`);
export const fetchUser = (id) => API.get(`/users/${id}`); // Corrected: remove leading '/' if baseURL has '/api'
export const updateUser = (id, credentials) =>
  API.put(`/users/${id}`, credentials);
export const fetchAllUsers = () => API.get("/users");

export const addToViewed = (userId, movieId) =>
  API.put(`/users/viewed/add/${userId}`, { movieId }); // Sending movieId in body
export const removeFromViewed = (userId, movieId) =>
  API.put(`/users/viewed/remove/${userId}`, { movieId }); // Sending movieId in body

export const addToLiked = (userId, movieId) =>
  API.put(`/users/liked/add/${userId}`, { movieId }); // Sending movieId in body
export const removeFromLiked = (userId, movieId) =>
  API.put(`/users/liked/remove/${userId}`, { movieId }); // Sending movieId in body

export const addToWatchList = (userId, movieId) =>
  API.put(`/users/watchlist/add/${userId}`, { movieId }); // Sending movieId in body
export const removeFromWatchList = (userId, movieId) =>
  API.put(`/users/watchlist/remove/${userId}`, { movieId }); // Sending movieId in body
