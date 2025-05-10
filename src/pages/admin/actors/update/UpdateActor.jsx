import React, { useEffect, useState, useMemo } from "react";
import * as api from "../../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import languages from "../../../../context/languages";
import Genre from "../../../user/user/components/Genre";
import "./update.css";

const UpdateActor = () => {
  const location = useLocation();
  const { actor } = location.state || {};
  const [formData, setFormData] = useState({
    name: actor.name || "",
    debutMovie: actor.debutMovie || null,
    image: actor.image || "",
    languages: actor.languages || [],
    mostFamousMovies: actor.mostFamousMovies || [],
  });

  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const allLanguages = languages;
  const [selectedLanguages, setSelectedLanguages] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [allMovies, setAllMovies] = useState([]);
  const [allMoviesByActor, setAllMoviesByActor] = useState([]);
  const [famousMovies, setFamousMovies] = useState(actor.mostFamousMovies);
  const [leftSortConfig, setLeftSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [rightSortConfig, setRightSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [allMovieResponse, movieActedByActor] = await Promise.all([
          api.fetchMovies(),
          api.fetchMovies({ actor: actor._id }),
        ]);
        console.log(allMovieResponse.data);
        console.log(movieActedByActor.data);
        setAllMovies(allMovieResponse.data);

        const filteredMovies = [];
        for (const movieInFirstList of movieActedByActor.data) {
          let flag = 1;
          for (const movieInSecondList of actor.mostFamousMovies) {
            if (movieInFirstList._id === movieInSecondList._id) {
              flag = 0;
              break;
            }
          }
          if (flag) {
            filteredMovies.push(movieInFirstList);
          }
        }

        console.log(filteredMovies);
        console.log(actor.mostFamousMovies);

        setAllMoviesByActor(filteredMovies);
      } catch (err) {
        console.log("fetch movie error", err.message);
      }
    };

    const langs = {};
    allLanguages.forEach((lang) => {
      if (actor.languages.includes(lang)) {
        langs[lang] = true;
      } else {
        langs[lang] = false;
      }
    });
    setSelectedLanguages(langs);
    console.log(langs);

    fetchMovies();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(selectedLanguages);
    const langs = Object.keys(selectedLanguages).filter(
      (lang) => selectedLanguages[lang]
    );
    console.log(langs);

    const famousMovieList = [];
    famousMovies.forEach((movie) => {
      famousMovieList.push(movie._id);
    });

    console.log(famousMovieList);

    const data = {
      name: formData.name,
      debutMovie: formData.debutMovie,
      languages: langs,
      mostFamousMovies: famousMovieList,
      image: actor.image,
    };

    try {
      const response = await api.updateActor(actor._id, data);
      console.log("response:", response.data);
      navigate("/admin/home");
    } catch (error) {
      console.error("Error creating actor:", error);
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

  const handleLanguageChange = (language) => {
    setSelectedLanguages((prev) => ({
      ...prev,
      [language]: !prev[language],
    }));
  };

  const sortedLeftMovies = useMemo(() => {
    let sortableLeftMovies = [...allMoviesByActor];
    if (leftSortConfig.key !== null) {
      sortableLeftMovies.sort((a, b) => {
        const aValue = a[leftSortConfig.key];
        const bValue = b[leftSortConfig.key];

        if (aValue < bValue) return leftSortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return leftSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableLeftMovies;
  }, [allMoviesByActor, leftSortConfig]);

  const sortedRightMovies = useMemo(() => {
    let sortableRightMovies = [...famousMovies];
    if (rightSortConfig.key !== null) {
      sortableRightMovies.sort((a, b) => {
        const aValue = a[rightSortConfig.key];
        const bValue = b[rightSortConfig.key];

        if (aValue < bValue)
          return rightSortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return rightSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableRightMovies;
  }, [famousMovies, rightSortConfig]);

  const handleLeftSort = (key) => {
    let direction = "asc";
    if (leftSortConfig.key === key && leftSortConfig.direction === "asc") {
      direction = "desc";
    }
    setLeftSortConfig({ key, direction });
  };

  const handleRightSort = (key) => {
    let direction = "asc";
    if (rightSortConfig.key === key && rightSortConfig.direction === "asc") {
      direction = "desc";
    }
    setRightSortConfig({ key, direction });
  };

  const addToRightList = (movie) => {
    const updatedLeft = allMoviesByActor.filter(
      (mov) => String(mov._id) !== String(movie._id)
    );

    setAllMoviesByActor(updatedLeft);
    setFamousMovies((prev) => [...prev, movie]);
  };

  const addToLeftList = (movie) => {
    setAllMoviesByActor((prev) => [...prev, movie]);
    const updatedRight = famousMovies.filter(
      (mov) => String(mov._id) !== String(movie._id)
    );

    setFamousMovies(updatedRight);
  };

  return (
    <div className="add-actor-page">
      <div className="add-actor-page-wrapper">
        <form action="" className="add-genre-page-wrapper">
          <div className="add-genre-image-div">
            <img src={`/backend/${actor.image}`} alt="No internet" width={200} />
          </div>
          <div className="add-genre-content-div">
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
              <label htmlFor="debutMovie" className="add-genre-label">
                DEBUT MOVIE
              </label>
              <select
                name="debutMovie"
                value={formData.debutMovie._id}
                className="admin-input-field"
                onChange={(e) => handleChange(e)}
              >
                <option value="null">None</option>
                {allMovies.map((movie, index) => (
                  <option value={movie._id} key={index}>
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="add-genre-label-div">
              <label htmlFor="languages" className="add-genre-label">
                LANGUAGES
              </label>
              <div className="add-movie-genres">
                {allLanguages.map((language, index) => (
                  <Genre
                    key={index}
                    genre={language}
                    selected={selectedLanguages[language] || false}
                    onAdd={() => handleLanguageChange(language)}
                  />
                ))}
              </div>
            </div>
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
          </div>
        </form>
        <div className="add-movie-tables-div">
          <table className="general-table update-movie-table">
            <thead>
              <tr>
                <th className="table-head">#</th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleLeftSort("title")}
                >
                  Title{" "}
                  {leftSortConfig.key === "title"
                    ? leftSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleLeftSort("language")}
                >
                  Language{" "}
                  {leftSortConfig.key === "language"
                    ? leftSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLeftMovies.map((movie, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{movie.title}</td>

                    <td className="table-data">{movie.language}</td>
                    <td className="table-data">
                      <button
                        className="actor-table-button table-actor-add-button"
                        onClick={() => addToRightList(movie)}
                      >
                        +
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <table className="general-table update-movie-table">
            <thead>
              <tr>
                <th className="table-head">#</th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleRightSort("title")}
                >
                  Title{" "}
                  {rightSortConfig.key === "title"
                    ? rightSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
                <th
                  className="table-head sortable-table-head"
                  onClick={() => handleRightSort("language")}
                >
                  Language{" "}
                  {rightSortConfig.key === "language"
                    ? rightSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRightMovies.map((movie, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{movie.title}</td>

                    <td className="table-data">{movie.language}</td>
                    <td className="table-data">
                      <button
                        className="actor-table-button table-actor-minus-button"
                        onClick={() => addToLeftList(movie)}
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

export default UpdateActor;
