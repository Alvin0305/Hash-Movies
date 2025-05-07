import React, { useState } from "react";
import * as api from "../../../../api";
import "./add.css";
import { useNavigate } from "react-router-dom";

const AddPlatform = () => {
  const [formData, setFormData] = useState({
    name: "",
    link: "",
    logo: "",
    supportedRegions: [],
  });

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
    data.append("name", formData.name || "newPlatform");
    data.append("link", formData.link || "newLink");
    if (file) {
      data.append("logo", file);
    }

    console.log(data.name);

    try {
      const response = await api.createPlatform(data);
      console.log("response:", response.data);
        navigate("/admin/home");
    } catch (error) {
      console.error("Error creating platform:", error);
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
          <label htmlFor="platformImage" className="admin-add-plus-button">
            +
          </label>
          <input
            id="platformImage"
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
            <label htmlFor="link" className="add-genre-label">
              LINK
            </label>
            <input
              type="text"
              name="link"
              className="admin-input-field"
              onChange={(e) => handleChange(e)}
            />
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

export default AddPlatform;
