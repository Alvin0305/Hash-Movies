import React, { useState, useEffect, useMemo } from "react";
import * as api from "../../../../api";
import "./update.css";
import { useNavigate, useLocation } from "react-router-dom";

const UpdateGenre = () => {
  const location = useLocation();
  const { genre } = location.state || {};

  const [formData, setFormData] = useState({
    name: genre.name || "",
    description: genre.description || "",
    image: genre.image || "",
    movies: genre.movies || [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const genreData = {
      name: formData.name,
      description: formData.description,
      image: genre.image,
      movies: moviesInGenre,
    };

    console.log("data to be updated: ", genreData);

    try {
      const response = await api.updateGenre(genre._id, genreData);
      console.log("response:", response.data);
      navigate("/admin/home");
    } catch (error) {
      console.error("Error updating genre:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
      } else if (error.request) {
        console.error("No response received from server.");
      } else {
        console.error("Error setting up request:", error.message);
      }
    }
  };

  const [moviesNotInGenre, setMoviesNotInGenre] = useState([]);
  const [moviesInGenre, setMoviesInGenre] = useState([]);
  const [sortConfigForNotIn, setSortConfigForNotIn] = useState({
    key: null,
    direction: "asc",
  });
  const [sortConfigForIn, setSortConfigForIn] = useState({
    key: null,
    direction: "asc",
  });

  const sortedMoviesForNotIn = useMemo(() => {
    let sortableMovies = [...moviesNotInGenre];
    if (sortConfigForNotIn.key !== null) {
      sortableMovies.sort((a, b) => {
        const aValue = a[sortConfigForNotIn.key];
        const bValue = b[sortConfigForNotIn.key];

        if (aValue < bValue)
          return sortConfigForNotIn.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return sortConfigForNotIn.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableMovies;
  }, [moviesNotInGenre, sortConfigForNotIn]);

  const sortedMoviesForIn = useMemo(() => {
    let sortableMovies = [...moviesInGenre];
    if (sortConfigForIn.key !== null) {
      sortableMovies.sort((a, b) => {
        const aValue = a[sortConfigForIn.key];
        const bValue = b[sortConfigForIn.key];

        if (aValue < bValue)
          return sortConfigForIn.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return sortConfigForIn.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableMovies;
  }, [moviesInGenre, sortConfigForIn]);

  const handleSortForNotIn = (key) => {
    let direction = "asc";
    if (
      sortConfigForNotIn.key === key &&
      sortConfigForNotIn.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfigForNotIn({ key, direction });
  };

  const handleSortForIn = (key) => {
    let direction = "asc";
    if (sortConfigForIn.key === key && sortConfigForIn.direction === "asc") {
      direction = "desc";
    }
    setSortConfigForIn({ key, direction });
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.fetchMovies();
        console.log("movies in genre", genre.movies);
        console.log("all movies", response.data);
        const moviesNotInGenre = [];
        const moviesInGenre = [];
        response.data.forEach((data) => {
          if (genre.movies.some((movie) => movie._id === data._id)) {
            moviesInGenre.push(data);
          } else {
            moviesNotInGenre.push(data);
          }
        });
        setMoviesNotInGenre(moviesNotInGenre);
        setMoviesInGenre(moviesInGenre);
      } catch (err) {
        console.log("movie fetch error: ", err.message);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="add-genre-page">
      <div className="update-genre-page-wrapper-div">
        <form action="" className="add-genre-page-wrapper">
          <div className="add-genre-image-div">
            <img src={`/backend/${formData.image}`} alt="No internet" width={300} />
          </div>
          <div className="add-genre-content-div">
            <div className="add-genres-buttons">
              <button
                className="add-genre-button add-genre-cancel-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/home");
                }}
              >
                CANCEL
              </button>
              <button
                onClick={(e) => handleSubmit(e)}
                className="add-genre-button add-genre-save-button"
              >
                SAVE
              </button>
            </div>
            <div className="add-genre-label-div">
              <label htmlFor="name" className="add-genre-label">
                NAME
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                className="admin-input-field"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="add-genre-label-div">
              <label htmlFor="description" className="add-genre-label">
                DESCRIPTION
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                className="add-genre-description"
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
          </div>
        </form>
        <div className="update-genre-tables">
          <table className="general-table update-genre-table update-genre-left-table">
            <thead>
              <tr>
                <th className="table-head">#</th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleSortForNotIn("title")}
                >
                  Title{" "}
                  {sortConfigForNotIn.key === "title"
                    ? sortConfigForNotIn.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleSortForNotIn("language")}
                >
                  Language{" "}
                  {sortConfigForNotIn.key === "language"
                    ? sortConfigForNotIn.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMoviesForNotIn.map((movie, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{movie.title}</td>
                    <td className="table-data">{movie.language}</td>
                    <td className="table-data">
                      <button
                        className="table-button update-genre-table-button table-add-button"
                        onClick={() => {
                          setMoviesInGenre([...moviesInGenre, movie]);
                          setMoviesNotInGenre(
                            moviesNotInGenre.filter(
                              (mov) => mov._id !== movie._id
                            )
                          );
                        }}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className="general-table update-genre-table update-genre-right-table">
            <thead>
              <tr>
                <th className="table-head">#</th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleSortForIn("title")}
                >
                  Title{" "}
                  {sortConfigForIn.key === "title"
                    ? sortConfigForIn.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleSortForIn("language")}
                >
                  Language{" "}
                  {sortConfigForIn.key === "language"
                    ? sortConfigForIn.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMoviesForIn.map((movie, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{movie.title}</td>
                    <td className="table-data">{movie.language}</td>
                    <td className="table-data">
                      <button
                        className="table-button update-genre-table-button table-remove-button"
                        onClick={() => {
                          setMoviesNotInGenre([...moviesNotInGenre, movie]);
                          setMoviesInGenre(
                            moviesInGenre.filter((mov) => mov._id !== movie._id)
                          );
                        }}
                      >
                        -
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpdateGenre;
