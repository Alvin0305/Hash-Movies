import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../../../api";
import LoadingPage from "../loading/LoadingPage";
import FlowPane from "../home/utils/FlowPane";
import "./language.css";

const LanguagePage = () => {
  const location = useLocation();
  const { language } = location.state || {};
  const { user } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const response = await api.fetchMovies({ language: language });
        console.log("language: ", response.data);
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        console.log("movie error", err.message);
      }
    };
    getMovies();
  }, [language]);

  return (
    <div>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="language-page">
          <h1 className="home-page-sub-heading">{language} Movies</h1>
          {movies.length === 0 ? (
            <p>No Films in this Language</p>
          ) : (
            <FlowPane movies={movies} user={user}/>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguagePage;
