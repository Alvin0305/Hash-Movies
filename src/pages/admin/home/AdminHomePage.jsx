import React, { useState } from "react";
import Users from "../user/Users";
import Movies from "../movie/Movies";
import Genres from "../genres/Genres";
import Platforms from "../platforms/Platforms";
import "./home.css";

const AdminHomePage = () => {
  const [selectedPage, setSelectedPage] = useState(0);
  const pages = [<Users />, <Movies />, <Genres />, <Platforms />];
  const pageNames = ["Users", "Movies", "Genres", "Platforms"];
  return (
    <div className="admin-home-page">
      <div className="admin-home-page-nav-bar">
        {pageNames.map((page, index) => (
          <button key={index} onClick={() => setSelectedPage(index)} className="admin-home-page-nav-button">
            {page}
          </button>
        ))}
      </div>
      <div>{pages[selectedPage]}</div>
    </div>
  );
};

export default AdminHomePage;
