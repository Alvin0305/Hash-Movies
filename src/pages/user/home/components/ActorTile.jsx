import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";
import "./actortile.css";

const ActorTile = ({ actor }) => {
  const navigate = useNavigate();
  const navigateToActorPage = () => {
    navigate("/home/actor", { state: { actor } });
  };
  return (
    <div className="actor-tile">
      <img
        src={actor.image}
        alt="No internet"
        className="actor-tile-image"
        onClick={navigateToActorPage}
      />
      <h3 className="actor-tile-text">{actor.name}</h3>
    </div>
  );
};

export default ActorTile;
