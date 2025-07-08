import React from "react";
import "./utils.css";
import ActorTile from "../components/ActorTile";

const ActorsScrollPane = ({ actors }) => {
  return (
    <div className="scroll-pane">
      {actors?.map((actor, index) => (
        <ActorTile actor={actor} key={index} />
      ))}
    </div>
  );
};

export default ActorsScrollPane;
