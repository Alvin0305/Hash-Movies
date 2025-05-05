import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../../../api";
import ScrollPane from "../home/utils/ScrollPane";
import "./genre.css";
import { FaBackward } from "react-icons/fa";

const GenrePage = () => {
  const location = useLocation();
  const genre = location.state.genre || {};

  const navigate = useNavigate();

  const movies = genre.movies;
  let [featuredFilms, setFeaturedFilms] = useState([]);
  let [trendingFilms, setTrendingFilms] = useState([]);

  useEffect(() => {
    featuredFilms = movies.filter((movie) => movie.isFeatured);
    trendingFilms = movies.filter((movie) => movie.isTrending);
    setFeaturedFilms(featuredFilms);
    setTrendingFilms(trendingFilms);
  }, []);

  const navigateToHome = () => {
    navigate("/home");
  };

  return (
    <div className="genre-page">
      <div className="genre-page-side-bar">
        <FaBackward
          size={30}
          onClick={navigateToHome}
          className="movie-page-sidebar-back-button"
        />
        <h1>{genre.name}</h1>
        <img src={genre.image} alt="No internet" className="genre-page-image" />
        <p>{genre.description}</p>
      </div>
      <div className="genre-page-content">
        <h1>Trending {genre.name} Films</h1>
        <ScrollPane movies={trendingFilms} />
        <h1>Featured {genre.name} Films</h1>
        <ScrollPane movies={featuredFilms} />
        <h1>{genre.name} Films</h1>
        <ScrollPane movies={movies} />
      </div>
    </div>
  );
};

export default GenrePage;
