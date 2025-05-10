import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../../../api";
import FlowPane from "../home/utils/FlowPane";
import LoadingPage from "../loading/LoadingPage";

const WatchListPage = () => {
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
        setMovies(response.data.watchList);
        setLoading(false);
      } catch (err) {
        console.log("error", err.message);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="watchList-page">
      <h1 className="home-page-sub-heading">Movies in Watch List</h1>
      <FlowPane movies={movies} />
    </div>
  );
};

export default WatchListPage;
