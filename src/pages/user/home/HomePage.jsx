import React, { useRef, useState, useEffect } from "react";
import GenresSession from "./components/GenresSession/GenresSession";
import "./utils/utils.css";
import TrendingSession from "./components/TrendingSession/TrendingSession";
import FeaturedSession from "./components/FeaturedSession/FeaturedSession";
import Dashboard from "./components/Dashboard/Dashboard";
import LanguagesSession from "./components/LanguagesSession/LanguagesSession";
import UserGenres from "./components/UserGenres/UserGenres";
import * as api from "../../../api";
import LoadingPage from "../loading/LoadingPage";
import UserLanguages from "./components/UserLanguages/UserLanguages";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const HomePage = () => {
  const genresRef = useRef(null);
  const featuredRef = useRef(null);
  const trendingRef = useRef(null);
  const languagesRef = useRef(null);

  const location = useLocation();
  const { user } = location.state || {};

  const navigate = useNavigate();

  const [data, setData] = useState({
    userGenres: [],
    trendingMovies: [],
    featuredMovies: [],
    prefLanguages: [],
    genres: [],
    loading: true,
  });

  const scrollTo = {
    genres: () => genresRef.current?.scrollIntoView({ behavior: "smooth" }),
    featured: () => featuredRef.current?.scrollIntoView({ behavior: "smooth" }),
    trending: () => trendingRef.current?.scrollIntoView({ behavior: "smooth" }),
    languages: () =>
      languagesRef.current?.scrollIntoView({ behavior: "smooth" }),
  };

  useEffect(() => {
    console.log("user in home page:", user);
    const fetchAllData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true }));

        const [userRes, trendingRes, featuredRes, genresRes] =
          await Promise.all([
            api.fetchUser(user._id),
            api.fetchMovies({ isTrending: true }),
            api.fetchMovies({ isFeatured: true }),
            api.fetchGenres(),
          ]);

        setData({
          userGenres: userRes.data.interestedGenres,
          trendingMovies: trendingRes.data,
          featuredMovies: featuredRes.data,
          prefLanguages: userRes.data.languages,
          genres: genresRes.data,
          loading: false,
        });
      } catch (err) {
        console.log("error: ", err);
        setData((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };
    fetchAllData();
  }, [user._id]);

  if (data.loading) return <LoadingPage />;

  return (
    <div className="home-page">
      <Dashboard {...scrollTo} user={user} />
      <button
        className="home-search-button"
        onClick={() => navigate("/home/search")}
      >
        <FaSearch size={40} color="white" />
      </button>
      <div className="home-page-contents">
        <div ref={trendingRef}>
          <TrendingSession movies={data.trendingMovies} user={user}/>
        </div>
        <div ref={featuredRef}>
          <FeaturedSession movies={data.featuredMovies} user={user}/>
        </div>
        <div ref={genresRef}>
          <GenresSession genres={data.genres} user={user}/>
        </div>
        <div ref={languagesRef}>
          <LanguagesSession user={user}/>
        </div>
        <div>
          <UserGenres genres={data.userGenres} user={user}/>
        </div>
        <div>
          <UserLanguages languages={data.prefLanguages} user={user}/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
