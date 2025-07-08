import React, { useEffect, useState } from "react";
import UserGenre from "./UserGenre";

const UserGenres = ({ genres }) => {
  return (
    <div>
      {genres.map((genre, index) => (
        <UserGenre genre={genre} key={index} />
      ))}
    </div>
  );
};

export default UserGenres;
