import React from "react";
import "../utils/utils.css";
import { useNavigate } from "react-router-dom";

const ActorTile = ({ actor, user }) => {
  const navigate = useNavigate();
  const navigateToActorPage = () => {
    navigate("/home/actor", { state: { actor: actor, user: user } });
  };
  return (
    <div className="large-tile">
      <img
        src={`/backend/${actor.image}`}
        alt="No internet"
        className="large-tile-image"
        onClick={navigateToActorPage}
      />
      <h1 className="large-tile-text">{actor.name}</h1>
    </div>
  );
};

export default ActorTile;
