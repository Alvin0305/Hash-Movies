import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const ActorTile = ({ actor, user }) => {
  const navigate = useNavigate();
  const navigateToActorPage = () => {
    navigate("/home/actor", { state: { actor: actor, user: user } });
  };
  return (
    <div className="actor-tile">
      <img
        src={`/backend/${actor.image}`}
        alt="No internet"
        className="actor-tile-image"
        onClick={navigateToActorPage}
      />
      <h1 className="actor-tile-text">{actor.name}</h1>
    </div>
  );
};

export default ActorTile;
