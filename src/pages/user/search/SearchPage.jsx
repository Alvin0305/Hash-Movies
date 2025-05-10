import React, { useEffect, useState } from "react";
import FlowPane from "../home/utils/FlowPane";
import "./search.css";
import { FaAngleDown, FaArrowDown, FaSearch, FaSortDown } from "react-icons/fa";
import Genre from "../user/components/Genre";
import * as api from "../../../api";
import { useLocation } from "react-router-dom";
import Selector from "./Selector";

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);

  const location = useLocation();
  const { user } = location.state || {};

  const [allGenres, setAllGenres] = useState([]);
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [filter, setFilter] = useState({});

  const [selectedGenres, setSelectedGenres] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [trending, setTrending] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [matchType, setMatchType] = useState("and");

  const initialiseObjects = (allGenres, allPlatforms) => {
    allGenres.forEach((genre) => {
      selectedGenres[genre._id] = false;
    });
    allPlatforms.forEach((platform) => {
      selectedPlatforms[platform._id] = false;
    });

    console.log(selectedGenres);
    console.log(selectedPlatforms);
  };

  useEffect(() => {
    const fetchInitialValues = async () => {
      try {
        const [genreResponse, platformResponse] = await Promise.all([
          api.fetchGenres(),
          api.fetchPlatforms(),
        ]);
        console.log(genreResponse.data);
        console.log(platformResponse.data.platforms);
        setAllGenres(genreResponse.data);
        setAllPlatforms(platformResponse.data.platforms);

        initialiseObjects(genreResponse.data, platformResponse.data.platforms);
      } catch (err) {
        console.log("error inside use effect", err.message);
      }
    };
    fetchInitialValues();
    findMovies();
  }, []);

  const findMovies = () => {
    const genreIds = Object.keys(selectedGenres).filter(
      (id) => selectedGenres[id]
    );
    const platformIds = Object.keys(selectedPlatforms).filter(
      (id) => selectedPlatforms[id]
    );

    const fetchMovies = async () => {
      try {
        const filter = {};
        filter.matchType = matchType;
        if (searchValue.length !== 0) {
          filter.title = searchValue;
        }
        if (genreIds.length === 1) {
          filter.genre = genreIds[0];
        } else if (genreIds.length !== 0) {
          filter.genres = genreIds;
        }

        if (platformIds.length !== 0) {
          filter.platforms = platformIds;
        }
        if (trending) {
          filter.isTrending = true;
        }
        if (featured) {
          filter.isFeatured = true;
        }
        console.log(genreIds);
        console.log(platformIds);
        console.log(filter);
        const movieResponse = await api.fetchMovies(filter);
        console.log(movieResponse.data);
        setMovies(movieResponse.data);
      } catch (err) {
        console.log("fetch movie error", err.message);
      }
    };
    fetchMovies();
  };

  const toggleOnGenreSelector = (id) => {
    setSelectedGenres((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    findMovies();
  };

  const toggleOnPlatformSelector = (id) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    findMovies();
  };

  useEffect(() => {
    console.log("refreshing");
    findMovies();
  }, [
    trending,
    featured,
    selectedGenres,
    selectedPlatforms,
    searchValue,
    matchType,
  ]);

  const [showGenres, setShowGenres] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showSelectors, setShowSelectors] = useState(false);

  return (
    <div className="search-page">
      <form className="search-page-form">
        <div className="search-bar-wrapper">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />
            <FaSearch
              size={30}
              color="white"
              className="search-icon"
              onClick={findMovies}
            />
          </div>
          <select
            name="matchType"
            id="matchType"
            value={matchType}
            onChange={(e) => setMatchType(e.target.value)}
            className="search-page-select"
          >
            <option value="and">AND</option>
            <option value="or">OR</option>
          </select>
        </div>
        <div className="search-page-contents">
          <div className="search-page-genre-head-div">
            <h1 className="search-page-heading">GENRES</h1>
            <FaAngleDown
              onClick={() => setShowGenres(!showGenres)}
              className="search-show-selector"
            />
          </div>
          {showGenres && (
            <div className="search-page-selectors">
              {allGenres.map((genre, index) => (
                <Genre
                  key={index}
                  genre={genre.name}
                  onAdd={() => toggleOnGenreSelector(genre._id)}
                  selected={selectedGenres[genre._id]}
                />
              ))}
            </div>
          )}
          <div>
            <div className="search-page-genre-head-div">
              <h1 className="search-page-heading">PLATFORMS</h1>
              <FaAngleDown
                onClick={() => setShowPlatforms(!showPlatforms)}
                className="search-show-selector"
              />
            </div>
            {showPlatforms && (
              <div className="search-page-selectors">
                {allPlatforms.map((platform, index) => (
                  <Genre
                    key={index}
                    genre={platform.name}
                    onAdd={() => toggleOnPlatformSelector(platform._id)}
                    selected={selectedPlatforms[platform._id]}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="search-page-genre-head-div">
              <h1 className="search-page-heading">FILTERS</h1>
              <FaAngleDown
                onClick={() => setShowSelectors(!showSelectors)}
                className="search-show-selector"
              />
            </div>
            {showSelectors && (
              <div className="search-page-selectors">
                <Selector
                  value="Trending"
                  onAdd={() => setTrending(!trending)}
                  selected={trending}
                />
                <Selector
                  value="Featured"
                  onAdd={() => setFeatured(!featured)}
                  selected={featured}
                />
              </div>
            )}
          </div>
          <div className="search-page-movies">
            <FlowPane movies={movies} user={user} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchPage;
