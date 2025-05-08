import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ScrollPane from "../home/utils/ScrollPane";
import * as api from "../../../api";
import "./actor.css";

const ActorPage = () => {
  const location = useLocation();
  const { actor, user } = location.state || {};

  const [mostFamousMovies, setMostFamousMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [debutMovie, setDebutMovie] = useState({});

  useEffect(() => {
    console.log(actor);
    const mostFamousMovieList = [];
    const fetchMostFamousMovies = async () => {
      try {
        for (const id of actor.mostFamousMovies) {
          const response = await api.fetchMovieById(id);
          console.log(response.data);
          mostFamousMovieList.push(response.data);
        }
        const debutResponse = await api.fetchMovieById(actor.debutMovie);
        console.log(debutResponse.data);
        setDebutMovie(debutResponse.data);
        setMostFamousMovies(mostFamousMovieList);
      } catch (err) {
        console.log("fetch movie error", err.message);
      }
    };

    const fetchActorMovies = async () => {
      try {
        const response = await api.fetchMovies({ actor: actor._id });
        console.log(response.data);
        setMovies(response.data);
      } catch (err) {
        console.log("fetch movie by actor movie", err.message);
      }
    };

    fetchMostFamousMovies();
    fetchActorMovies();

    console.log(actor.mostFamousMovies);
  }, []);
  return (
    <div className="actor-page">
      <div className="actor-page-wrapper">
        <div className="actor-page-left-div">
          <h1>{actor.name.toUpperCase()}</h1>
          <img src={`/backend/${actor.image}`} alt="No internet" width={300} />
          <div className="actor-page-details-div">
            <h4 className="actor-page-sub-heading">DEBUT MOVIE</h4>
            <h2 className="actor-page-value">{debutMovie.title}</h2>
            <h4 className="actor-page-sub-heading">LANGUAGES</h4>
            <div className="actor-page-languages">
              {actor.languages.map((language, index) => (
                <h4 key={index} className="actor-page-language">
                    {language}
                  
                </h4>
              ))}
            </div>
          </div>
        </div>
        <div className="actor-page-content-div">
          <h1 className="home-page-sub-heading">MOST FAMOUS MOVIES</h1>
          <ScrollPane movies={mostFamousMovies} user={user} />
          <h1 className="home-page-sub-heading">
            MOVIES OF {actor.name.toUpperCase()}
          </h1>
          <ScrollPane movies={movies} user={user} />
        </div>
      </div>
    </div>
  );
};

export default ActorPage;
