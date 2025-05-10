import React, { useState } from "react";
import * as api from "../../../../api";
import "./add.css";
import { useLocation, useNavigate } from "react-router-dom";

const AddGenre = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    movies: [],
  });

  const location = useLocation();
  const { user } = location.state || {};
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name || "newGenre");
    data.append("description", formData.description || "new description");
    if (file) {
      data.append("image", file);
    }

    try {
      const response = await api.createGenre(data);
      console.log("response:", response.data);
      navigate("/admin/home", { state: { user: user } });
    } catch (error) {
      console.error("Error creating genre:", error);
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

  return (
    <div className="add-genre-page">
      <form action="" className="add-genre-page-wrapper">
        <div className="add-genre-image-div">
          <label htmlFor="genreImage" className="admin-add-plus-button">
            +
          </label>
          <input
            id="genreImage"
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
            <label htmlFor="description" className="add-genre-label">
              DESCRIPTION
            </label>
            <textarea
              name="description"
              id="description"
              className="add-genre-description"
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>
          <div className="add-genres-buttons">
            <button
              className="add-genre-button add-genre-cancel-button"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/home", { state: { user: user } });
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

export default AddGenre;
