import React, { useEffect, useState } from "react";
import UserGenre from "./UserGenre";

const UserGenres = ({ genres, user }) => {
  return (
    <div>
      {genres.map((genre, index) => (
        <UserGenre genre={genre} key={index} user={user} />
      ))}
    </div>
  );
};

export default UserGenres;
