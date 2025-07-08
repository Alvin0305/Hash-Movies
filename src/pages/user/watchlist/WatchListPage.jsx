import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as api from "../../../api";
import FlowPane from "../home/utils/FlowPane";
import LoadingPage from "../loading/LoadingPage";
import { useUser } from "../../../context/UserContext";

const WatchListPage = () => {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("user", user);
        const response = await api.fetchUser(user._id);
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
