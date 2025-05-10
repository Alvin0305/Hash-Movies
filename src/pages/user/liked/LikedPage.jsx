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
    const fetchUser = async () => {
      try {
        console.log("user", user.user);
        const response = await api.fetchUser(user.user._id);
        console.log(response.data);
        setMovies(response.data.liked);
        setLoading(false);
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
      <FlowPane movies={movies} user={user}/>
    </div>
  );
};

export default LikedPage;
