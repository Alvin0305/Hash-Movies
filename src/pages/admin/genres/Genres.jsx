import React, { useState, useEffect, useMemo } from "react";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  const sortedGenres = useMemo(() => {
    let sortableGenres = [...genres];
    if (sortConfig.key !== null) {
      sortableGenres.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableGenres;
  }, [genres, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.fetchGenres();
        console.log(response.data);
        setGenres(response.data);
      } catch (err) {
        console.log("genre error: ", err.message);
      }
    };
    fetchGenres();
  }, []);

  const deleteGenre = (id) => {
    const deleteGen = async () => {
      try {
        const response = await api.deleteGenre(id);
        console.log(response.data);
        setGenres(genres.filter((genre) => genre._id !== id));
      } catch (err) {
        console.log("delete genre error: ", err.message);
      }
    };

    deleteGen();
  };

  return (
    <div className="admin-table-div">
      <h1 className="home-page-sub-heading">GENRES</h1>
      <table className="genre-table">
        <thead>
          <tr className="table-row">
            <th className="table-head">#</th>
            <th className="table-head">ID</th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("name")}
            >
              Name
              {sortConfig.key === "name"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedGenres.map((genre, index) => (
            <tr key={genre._id} className="table-row">
              <td className="table-data">{index + 1}</td>
              <td className="table-data">{genre._id}</td>
              <td className="table-data">{genre.name}</td>
              <td className="table-data">
                <button
                  className="table-button table-update-button"
                  onClick={() =>
                    navigate("/admin/genre/update", { state: { genre: genre } })
                  }
                >
                  Update
                </button>
              </td>
              <td className="table-data">
                <button
                  className="table-button table-delete-button"
                  onClick={() => deleteGenre(genre._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="admin-add-button"
        onClick={(e) => {
          e.preventDefault();
          navigate("/admin/genre/add");
        }}
      >
        +
      </button>
    </div>
  );
};

export default Genres;
