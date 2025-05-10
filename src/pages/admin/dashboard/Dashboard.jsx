import React from "react";
import { FaFilm, FaTheaterMasks, FaUser, FaUserTie } from "react-icons/fa";
import { MdConnectedTv, MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = ({
  scrollToUsers,
  scrollToMovies,
  scrollToGenres,
  scrollToPlatforms,
  scrollToActors,
}) => {
  const size = 20;

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="admin-page-dashboard">
      <div>
        <FaUser
          size={size}
          className="admin-dashboard-icon"
          onClick={scrollToUsers}
        />
        <FaFilm
          size={size}
          className="admin-dashboard-icon"
          onClick={scrollToMovies}
        />
        <FaTheaterMasks
          size={size}
          className="admin-dashboard-icon"
          onClick={scrollToGenres}
        />
        <MdConnectedTv
          size={size}
          className="admin-dashboard-icon"
          onClick={scrollToPlatforms}
        />
        <FaUserTie
          size={size}
          className="admin-dashboard-icon"
          onClick={scrollToActors}
        />
      </div>
      <MdLogout
        size={size}
        className="admin-dashboard-icon"
        onClick={handleLogout}
      />
    </div>
  );
};

export default Dashboard;
