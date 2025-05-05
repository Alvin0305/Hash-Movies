import React, { useEffect, useState } from "react";
import * as api from "../../../../../api";
import ScrollPane from "../../utils/ScrollPane";

const UserLanguage = ({ language }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.fetchMovies({ language: language });
        console.log(response.data);
        setMovies(response.data);
      } catch (err) {
        console.log("movie fetch error:", err.message);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1 className="home-page-sub-heading">{language} Movies</h1>
      {movies.length === 0 ? (
        <p className="home-page-text">No movies in this language</p>
      ) : (
        <ScrollPane movies={movies} />
      )}
    </div>
  );
};

export default UserLanguage;
