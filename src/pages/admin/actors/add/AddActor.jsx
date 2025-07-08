import React, { useEffect, useState } from "react";
import * as api from "../../../../api";
import { useLocation, useNavigate } from "react-router-dom";
import languages from "../../../../context/languages";
import Genre from "../../../user/user/components/Genre";

const AddActor = () => {
  const [formData, setFormData] = useState({
    name: "",
    debutMovie: null,
    image: "",
    languages: [],
    mostFamousMovies: [],
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
        const response = await api.fetchMovies();
        console.log(response.data);
        setAllMovies(response.data);
      } catch (err) {
        console.log("fetch movie error", err.message);
      }
    };

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

    const data = new FormData();
    data.append("name", formData.name || "newActor");
    data.append("debutMovie", formData.debutMovie);
    data.append("languages", langs);
    data.append("mostFamousMovies", [formData.debutMovie]);
    if (file) {
      console.log("file got");
      data.append("image", file);
    }

    try {
      const response = await api.createActor(data);
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

  return (
    <div className="add-genre-page">
      <form action="" className="add-genre-page-wrapper">
        <div className="add-genre-image-div">
          <label htmlFor="actorImage" className="admin-add-plus-button">
            +
          </label>
          <input
            id="actorImage"
            type="file"
            onChange={handleFileChange}
            className="admin-add-genre-image"
          />
          {file && <p>Selected file: {file.name}</p>}
        </div>
        <div className="add-genre-content-div">
          <div className="add-genre-label-div">
            <label htmlFor="name" className="add-genre-label">
              NAME
            </label>
            <input
              type="text"
              name="name"
              className="admin-input-field"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="add-genre-label-div">
            <label htmlFor="debutMovie" className="add-genre-label">
              NAME
            </label>
            <select
              name="debutMovie"
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
    </div>
  );
};

export default AddActor;
