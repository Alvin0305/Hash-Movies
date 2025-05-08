import React from "react";
import "./utils.css";
import ActorTile from "../components/ActorTile";

const ActorsScrollPane = ({ actors, user }) => {
  return (
    <div className="scroll-pane">
      {actors?.map((actor, index) => (
        <ActorTile actor={actor} user={user} key={index} />
      ))}
    </div>
  );
};

export default ActorsScrollPane;
