import React, { useEffect, useState, useMemo } from "react";
import * as api from "../../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import languages from "../../../../context/languages";
import Genre from "../../../user/user/components/Genre";

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
        setFamousMovies(movieActedByActor.data);
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

    const data = {
      name: formData.name,
      debutMovie: formData.debutMovie,
      languages: langs,
      mostFamousMovies: [formData.debutMovie],
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

  const [allMoviesByActor, setAllMoviesByActor] = useState([]);
  const [famousMovies, setFamousMovies] = useState([]);
  const [leftSortConfig, setLeftSortConfig] = useState({
    key: null,
    direction: "asc",
  });

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

  const handleLeftSort = (key) => {
    let direction = "asc";
    if (leftSortConfig.key === key && leftSortConfig.direction === "asc") {
      direction = "desc";
    }
    setLeftSortConfig({ key, direction });
  };

  return (
    <div className="add-genre-page">
      <form action="" className="add-genre-page-wrapper">
        <div className="add-genre-image-div">
          <img src={`${actor.image}`} alt="No internet" width={200} />
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
      <div>
        <table className="general-table">
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
      </div>
    </div>
  );
};

export default UpdateActor;
