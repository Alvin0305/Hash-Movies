import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend URL
});

// Auth
export const register = (userData) => API.post("/auth/register", userData);
export const login = (credentials) => API.post("/auth/login", credentials);

// Movies
export const fetchMovies = (params = {}) => API.get("/movies", { params });
export const createMovie = (movieData) => API.post("/movies", movieData);
export const updateMovie = (id, movieData) =>
  API.put(`/movies/${id}`, movieData);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// Actors
export const fetchActors = () => API.get("/actors");
export const createActor = (actorData) => API.post("/actors", actorData);

// Genres
export const fetchGenres = () => API.get("/genres");
export const createGenre = (genreData) => API.post("/genres", genreData);

// Platforms
export const fetchPlatforms = () => API.get("/platforms");
export const createPlatform = (platformData) =>
  API.post("/platforms", platformData);

// Reviews
export const fetchReviews = () => API.get("/reviews");
export const createReview = (reviewData) => API.post("/reviews", reviewData);

export const fetchWatchList = (id) => API.get(`/users/${id}/watchList`);
export const fetchUser = (id) => API.get(`users/${id}`);
export const updateUser = (id, credentials) =>
  API.put(`users/${id}`, credentials);
export const fetchAllUsers = () => API.get("/users");
