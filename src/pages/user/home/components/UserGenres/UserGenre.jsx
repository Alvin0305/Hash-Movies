import React, { useEffect, useState } from "react";
import ScrollPane from "../../utils/ScrollPane";
import * as api from "../../../../../api";

const UserGenre = ({ genre, user }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.fetchMovies({ genre: genre._id });
        console.log(response.data);
        setMovies(response.data);
      } catch (err) {
        console.log("error in genre: ", err.message);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1 className="home-page-sub-heading">{genre.name} Movies</h1>
      <ScrollPane movies={movies} user={user}/>
    </div>
  );
};

export default UserGenre;
