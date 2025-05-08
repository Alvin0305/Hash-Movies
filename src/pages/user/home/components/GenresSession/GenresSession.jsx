import React, { useEffect, useState } from "react";
import * as api from "../../../../../api";
import GenreTile from "../GenreTile";
import "../../utils/utils.css";

const GenresSession = ({ genres, user }) => {
  return (
    <div>
      <h1 className="home-page-sub-heading">Genres</h1>
      <div className="flow-pane">
        {genres.map((genre, index) => (
          <GenreTile genre={genre} key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default GenresSession;
