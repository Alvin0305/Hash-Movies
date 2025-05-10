import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const MovieTile = ({ movie, user }) => {
  const navigate = useNavigate();
  const navigateToMovies = () => {
    console.log("user in movie tile", user);
    navigate("/home/movie", { state: { movie: movie, user: user } });
  };
  return (
    <div className="movie-tile">
      <img
        src={movie.image}
        alt={movie.title || "Movie poster"}
        className="movie-tile-image"
        onClick={navigateToMovies}
      />
      <h2 className="movie-tile-text">{movie.title}</h2>
    </div>
  );
};

export default MovieTile;
