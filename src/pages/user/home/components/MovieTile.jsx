import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const MovieTile = ({ movie }) => {
  const navigate = useNavigate();
  const navigateToMovies = () => {
    navigate("/home/movie", { state: { movie: movie } });
  };
  return (
    <div className="movie-tile">
      <img
        src={movie.image}
        alt="No internet"
        className="movie-tile-image"
        onClick={navigateToMovies}
      />
      <h1 className="movie-tile-text">{movie.title}</h1>
    </div>
  );
};

export default MovieTile;
