import React, { useState } from 'react';
import * as api from '../api';

const RouteTester = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Test data
  const testMovie = {
    title: "Test Movie",
    director: "Test Director",
    releaseDate: "2023-01-01",
    genres: [], // Add genre IDs if available
    actors: [], // Add actor IDs if available
  };

  const testActor = {
    name: "Test Actor",
    debutMovie: null, // Add movie ID if available
  };

  const testGenre = {
    name: "Test Genre",
    description: "Test Description",
  };

  const testPlatform = {
    name: "Test Platform",
    link: "https://test.com",
    logo: "test.jpg",
  };

  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "test123",
  };

  const testCredentials = {
    usernameOrEmail: "testuser",
    password: "test123",
  };

  const testReview = {
    movie: null, // Add movie ID
    user: null, // Add user ID
    review: "Test review",
    rating: 8,
  };

  const testEndpoint = async (endpointName, apiCall) => {
    setLoading(true);
    try {
      const response = await apiCall();
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Backend Route Tester</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Auth Routes</h2>
        <button onClick={() => testEndpoint('Register', () => api.register(testUser))}>
          Test Register
        </button>
        <button onClick={() => testEndpoint('Login', () => api.login(testCredentials))}>
          Test Login
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Movie Routes</h2>
        <button onClick={() => testEndpoint('Get Movies', api.fetchMovies)}>
          Get Movies
        </button>
        <button onClick={() => testEndpoint('Create Movie', () => api.createMovie(testMovie))}>
          Create Movie
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Actor Routes</h2>
        <button onClick={() => testEndpoint('Get Actors', api.fetchActors)}>
          Get Actors
        </button>
        <button onClick={() => testEndpoint('Create Actor', () => api.createActor(testActor))}>
          Create Actor
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Genre Routes</h2>
        <button onClick={() => testEndpoint('Get Genres', api.fetchGenres)}>
          Get Genres
        </button>
        <button onClick={() => testEndpoint('Create Genre', () => api.createGenre(testGenre))}>
          Create Genre
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Platform Routes</h2>
        <button onClick={() => testEndpoint('Get Platforms', api.fetchPlatforms)}>
          Get Platforms
        </button>
        <button onClick={() => testEndpoint('Create Platform', () => api.createPlatform(testPlatform))}>
          Create Platform
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Review Routes</h2>
        <button onClick={() => testEndpoint('Get Reviews', api.fetchReviews)}>
          Get Reviews
        </button>
        <button onClick={() => testEndpoint('Create Review', () => api.createReview(testReview))}>
          Create Review
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Result:</h3>
        {loading ? <p>Loading...</p> : <pre>{result}</pre>}
      </div>
    </div>
  );
};

export default RouteTester;