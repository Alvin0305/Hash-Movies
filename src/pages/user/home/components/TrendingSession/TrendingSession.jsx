import React, { useEffect, useState } from "react";
import * as api from "../../../../../api";
import MovieTile from "../MovieTile";
import "../../utils/utils.css";
import ScrollPane from "../../utils/ScrollPane";

const TrendingSession = ({ movies, user }) => {
  return (
    <div>
      <h1 className="home-page-sub-heading">Trending Movies</h1>
      <ScrollPane movies={movies} user={user}/>
    </div>
  );
};

export default TrendingSession;
