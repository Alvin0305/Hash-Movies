import React from "react";
import MovieTile from "../components/MovieTile";

const FlowPane = ({ movies }) => {
  return (
    <div className="flow-pane">
      {movies.map((movie, index) => (
        <MovieTile movie={movie} key={index} />
      ))}
    </div>
  );
};

export default FlowPane;
