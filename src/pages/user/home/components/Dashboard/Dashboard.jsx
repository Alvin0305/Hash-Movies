import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaFire,
  FaHeart,
  FaLanguage,
  FaRegAddressBook,
  FaRegBookmark,
  FaStarAndCrescent,
} from "react-icons/fa";
import { MdBookmarkBorder, MdLogout, MdStar, MdStars } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
import "./Dashboard.css";

const Dashboard = ({ genres, trending, featured, languages, user }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/login");
  };

  const size = 25;

  const [showText, setShowText] = useState(false);

  return (
    <div
      className="dashboard"
      onMouseEnter={() => {
        console.log("mouse entered");
        setShowText(true);
      }}
      onMouseLeave={() => setShowText(false)}
    >
      <div className="dashboard-buttons">
        <div className="dashboard-inner-div dashboard-profile">
          <img
            src="/boy.png"
            width={40}
            alt="No internet"
            className="dashboard-avatar"
            onClick={() => navigate("/user", { state: { user: user } })}
          />
          {showText && (
            <h1 className="dashboard-username dashboard-text">
              {user.username.toUpperCase()}
            </h1>
          )}
        </div>
        <div className="dashboard-inner-div">
          <button
            className="dashboard-button"
            onClick={() => navigate("/home/liked", { state: { user: user } })}
          >
            <FaHeart size={size} color="red" className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">LIKED</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button
            className="dashboard-button"
            onClick={() => navigate("/home/viewed", { state: { user: user } })}
          >
            <FaEye size={size} color="white" className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">VIEWED</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button
            className="dashboard-button"
            onClick={() =>
              navigate("/home/watchList", { state: { user: user } })
            }
          >
            <FaRegBookmark size={size} className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">WATCHLIST</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button className="dashboard-button" onClick={trending}>
            <FaFire color="orange" size={size} className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">TRENDING</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button className="dashboard-button" onClick={featured}>
            <MdStar color="gold" size={size} className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">FEATURED</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button className="dashboard-button" onClick={genres}>
            <RiMovie2Line size={size} className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">GENRES</h1>}
          </button>
        </div>
        <div className="dashboard-inner-div">
          <button className="dashboard-button" onClick={languages}>
            <FaLanguage size={size} className="dashboard-icon" />
            {showText && <h1 className="dashboard-text">LANGUAGES</h1>}
          </button>
        </div>
      </div>
      <div className="dashboard-inner-div">
        <button className="dashboard-button" onClick={handleLogout}>
          <MdLogout size={size} className="dashboard-icon" />
          {showText && <h1 className="dashboard-text">LOG OUT</h1>}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
