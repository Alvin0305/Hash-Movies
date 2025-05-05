import React from "react";
import "../../utils/utils.css";
import { useNavigate } from "react-router-dom";

const Dashboard = ({ genres, trending, featured, languages, user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div className="dashboard-profile-area">
          <div className="dashboard-avatar-wrapper">
            <img
              src="/boy.png"
              alt="No internet"
              className="dashboard-avatar"
              onClick={() => navigate("/user", { state: { user: user } })}
            />
          </div>
          <h1>{user.username.toUpperCase()}</h1>
        </div>
        <div className="dashboard-buttons">
          <button
            className="dashboard-profile-button"
            onClick={() => navigate("/home/liked", { state: { user: user } })}
          >
            Liked
          </button>
          <button
            className="dashboard-profile-button"
            onClick={() => navigate("/home/viewed", { state: { user: user } })}
          >
            Viewed
          </button>
          <button
            className="dashboard-profile-button"
            onClick={() => navigate("/home/watchList", { state: { user: user } })}
          >
            Watch List
          </button>
          <button className="dashboard-button" onClick={trending}>
            Trending Movies
          </button>
          <button className="dashboard-button" onClick={featured}>
            Featured Movies
          </button>
          <button className="dashboard-button" onClick={genres}>
            Genres
          </button>
          <button
            className="dashboard-button dashboard-button-last"
            onClick={languages}
          >
            Languages
          </button>
        </div>
      </div>
      <button
        className="dashboard-button dashboard-button-last"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
};

export default Dashboard;
