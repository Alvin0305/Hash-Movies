import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../../../api";
import FlowPane from "../home/utils/FlowPane";
import LoadingPage from "../loading/LoadingPage";

const LikedPage = () => {
  const location = useLocation();
  const user = location.state || {};
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async (likedMovies) => {
      try {
        if (likedMovies.length === 0) {
          setMovies([]);
        } else {
          const likedMovieList = [];
          likedMovies.forEach(async (id) => {
            const response = await api.fetchMovieById(id);
            console.log(response.data);
            likedMovieList.push(response.data);
          });
          setMovies(likedMovieList);
          setLoading(false);
        }
      } catch (err) {
        console.log("error in fetching liked movies", err.message);
      }
    };

    const fetchUser = async () => {
      try {
        console.log("user", user.user);
        const response = await api.fetchUser(user.user._id);
        console.log(response.data);
        fetchMovies(response.data.liked);
      } catch (err) {
        console.log("error", err.message);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="liked-page">
      <h1 className="home-page-sub-heading">Liked Movies</h1>
      <FlowPane movies={movies} />
    </div>
  );
};

export default LikedPage;
