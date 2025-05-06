import React, { useEffect, useMemo, useState } from "react";
import * as api from "../../../api";
import { useNavigate } from "react-router-dom";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const sortedMovies = useMemo(() => {
    let sortableMovies = [...movies];
    if (sortConfig.key !== null) {
      sortableMovies.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableMovies;
  }, [movies, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.fetchMovies();
        setMovies(response.data);
      } catch (err) {
        console.log("movie fetch error: ", err.message);
      }
    };
    fetchMovies();
  }, []);

  const deleteMovie = (movie) => {
    setMovies(movies.filter((mov) => movie._id !== mov._id));

    const deleteMov = async () => {
      try {
        const response = await api.deleteMovie(movie._id);
      } catch (err) {
        console.log("delete movie error", err.message);
      }
    };

    deleteMov();
  };

  return (
    <div>
      <table className="general-table">
        <thead>
          <tr>
            <th className="table-head">#</th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("title")}
            >
              Title{" "}
              {sortConfig.key === "title"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("director")}
            >
              Director{" "}
              {sortConfig.key === "director"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("releaseDate")}
            >
              Release Date{" "}
              {sortConfig.key === "releaseDate"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("duration")}
            >
              Duration{" "}
              {sortConfig.key === "duration"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("language")}
            >
              Language{" "}
              {sortConfig.key === "language"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("certificate")}
            >
              Certificate{" "}
              {sortConfig.key === "certificate"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("isFeatured")}
            >
              Featured{" "}
              {sortConfig.key === "isFeatured"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("isTrending")}
            >
              Trending{" "}
              {sortConfig.key === "isTrending"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th
              className="table-head sortable-table-head"
              onClick={() => handleSort("rating")}
            >
              Rating{" "}
              {sortConfig.key === "rating"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedMovies.map((movie, index) => {
            return (
              <tr key={index}>
                <td className="table-data">{index + 1}</td>
                <td className="table-data">{movie.title}</td>
                <td className="table-data">{movie.director}</td>
                <td className="table-data">
                  {movie.releaseDate.split("T")[0]}
                </td>
                <td className="table-data">{movie.duration}</td>
                <td className="table-data">{movie.language}</td>
                <td className="table-data">{movie.certificate}</td>
                <td className="table-data">{movie.isFeatured ? "✅" : "❌"}</td>
                <td className="table-data">{movie.isTrending ? "✅" : "❌"}</td>
                <td className="table-data">{movie.rating}</td>
                <td className="table-data">
                  <button
                    className="table-button table-update-button"
                    onClick={() =>
                      navigate("/admin/movie/update", {
                        state: { movie: movie },
                      })
                    }
                  >
                    Update
                  </button>
                </td>
                <td className="table-data">
                  <button
                    className="table-button table-delete-button"
                    onClick={() => deleteMovie(movie)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <a href="/admin/movie/add">
        <button className="admin-add-button">+</button>
      </a>
    </div>
  );
};

export default Movies;
