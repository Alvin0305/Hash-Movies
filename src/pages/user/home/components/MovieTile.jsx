import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const MovieTile = ({ movie }) => {
  const navigate = useNavigate();

  const navigateToMovies = () => {
    navigate("/home/movie", { state: { movie } });
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
