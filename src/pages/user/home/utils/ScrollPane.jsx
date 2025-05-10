import React, { useEffect } from "react";
import "./utils.css";
import MovieTile from "../components/MovieTile";
import "./scrollpane.css";

const ScrollPane = ({ movies, user }) => {
  return (
    <div className="scroll-pane">
      {movies?.map((movie, index) => (
        <MovieTile movie={movie} key={index} user={user} />
      ))}
    </div>
  );
};

export default ScrollPane;
