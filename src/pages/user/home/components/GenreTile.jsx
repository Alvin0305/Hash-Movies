import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const GenreTile = ({ genre }) => {
  const navigate = useNavigate();
  const navigateToGenrePage = () => {
    navigate("/home/genre", { state: { genre } });
  };

  return (
    <div className="large-tile">
      <img
        src={genre.image}
        alt="No internet"
        className="large-tile-image"
        onClick={navigateToGenrePage}
      />
      <h1 className="large-tile-text">{genre.name}</h1>
    </div>
  );
};

export default GenreTile;
