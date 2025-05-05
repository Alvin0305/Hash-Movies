import React, { useState } from "react";
import FlowPane from "../home/utils/FlowPane";
import "./search.css";
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [movies, setMovies] = useState([]);

  return (
    <div className="search-page">
      <form className="search-bar-form">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-bar"
          />
          <FaSearch size={30} color="white" className="search-icon"/>
        </div>
      </form>
      <FlowPane movies={movies} />
    </div>
  );
};

export default SearchPage;
