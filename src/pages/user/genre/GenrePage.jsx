import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../../../api";
import ScrollPane from "../home/utils/ScrollPane";
import "./genre.css";
import { FaBackward } from "react-icons/fa";

const GenrePage = () => {
  const location = useLocation();
  const genre = location.state.genre || {};
  const user = location.state.user || {};

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  let [featuredFilms, setFeaturedFilms] = useState([]);
  let [trendingFilms, setTrendingFilms] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.fetchMoviesByGenre(genre._id);
        console.log("response.data: ", response.data);
        setMovies(response.data);
        featuredFilms = response.data.filter((movie) => movie.isFeatured);
        trendingFilms = response.data.filter((movie) => movie.isTrending);
        setFeaturedFilms(featuredFilms);
        setTrendingFilms(trendingFilms);
      } catch (err) {
        console.log("fetch movie by genre error", err.message);
      }
    };

    fetchMovies();
  }, []);

  const navigateToHome = () => {
    navigate("/home", { state: { user: user } });
  };

  return (
    <div className="genre-page">
      <div className="genre-page-side-bar">
        <FaBackward
          size={30}
          onClick={navigateToHome}
          className="movie-page-sidebar-back-button"
        />
        <h1 className="genre-name">{genre.name}</h1>
        <img
          src={`/backend/${genre.image}`}
          alt="No internet"
          className="genre-page-image"
        />
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
