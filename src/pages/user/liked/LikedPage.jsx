import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../../../api";
import FlowPane from "../home/utils/FlowPane";
import LoadingPage from "../loading/LoadingPage";
import { useUser } from "../../../context/UserContext";

const LikedPage = () => {
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("user", user);
        const response = await api.fetchUser(user._id);
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
      <FlowPane movies={movies} />
    </div>
  );
};

export default LikedPage;
