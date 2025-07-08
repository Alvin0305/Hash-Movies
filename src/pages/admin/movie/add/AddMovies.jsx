import { useState, useEffect, useMemo } from "react";
import * as api from "../../../../api";
import LoadingPage from "../../../user/loading/LoadingPage";
import Genre from "../../../user/user/components/Genre";
import "./add.css";
import { useLocation, useNavigate } from "react-router-dom";

const AddMovies = () => {
  const [formData, setFormData] = useState({
    title: "",
    director: "",
    releaseDate: "",
    image: "",
    actors: [],
    duration: "",
    language: "",
    certificate: "UA",
    isFeatured: false,
    isTrending: false,
    rating: 0,
    trailer: "",
    storyline: "",
  });

  const location = useLocation();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [allPlatforms, setAllPlatforms] = useState([]);
  const [platforms, setPlatforms] = useState({});
  const [allActors, setAllActors] = useState([]);
  const [actorsInMovie, setActorsInMovie] = useState([]);

  const [allActorsSortConfig, setAllActorsSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const [actorsInMovieSortConfig, setActorsInMovieSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const sortedAllActors = useMemo(() => {
    let sortableAllActors = [...allActors];
    if (allActorsSortConfig.key !== null) {
      sortableAllActors.sort((a, b) => {
        const aValue = a[allActorsSortConfig.key];
        const bValue = b[allActorsSortConfig.key];

        if (aValue < bValue)
          return allActorsSortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return allActorsSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableAllActors;
  }, [allActors, allActorsSortConfig]);

  const sortedActorsInMovie = useMemo(() => {
    let sortableActorsInMovie = [...actorsInMovie];
    if (actorsInMovieSortConfig.key !== null) {
      sortableActorsInMovie.sort((a, b) => {
        const aValue = a[actorsInMovieSortConfig.key];
        const bValue = b[actorsInMovieSortConfig.key];

        if (aValue < bValue)
          return actorsInMovieSortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue)
          return actorsInMovieSortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableActorsInMovie;
  }, [actorsInMovie, actorsInMovieSortConfig]);

  const handleAllActorsSort = (key) => {
    let direction = "asc";
    if (
      allActorsSortConfig.key === key &&
      allActorsSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setAllActorsSortConfig({ key, direction });
  };

  const handleActorsInMovieSort = (key) => {
    let direction = "asc";
    if (
      actorsInMovieSortConfig.key === key &&
      actorsInMovieSortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setActorsInMovieSortConfig({ key, direction });
  };

  const addToActorsInMovie = (movie) => {
    const updatedLeft = allActors.filter(
      (mov) => String(mov._id) !== String(movie._id)
    );

    setAllActors(updatedLeft);
    setActorsInMovie((prev) => [...prev, movie]);
  };

  const removeFromActorsInMovie = (movie) => {
    const updatedLeft = actorsInMovie.filter(
      (mov) => String(mov._id) !== String(movie._id)
    );

    setActorsInMovie(updatedLeft);
    setAllActors((prev) => [...prev, movie]);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllInitialData = async () => {
      setLoading(true);
      try {
        const [genreResponse, platformResponse, actorResponse] =
          await Promise.all([
            api.fetchGenres(),
            api.fetchPlatforms(),
            api.fetchActors(),
          ]);
        setAllGenres(genreResponse.data);
        setAllPlatforms(platformResponse.data.platforms);
        setAllActors(actorResponse.data);

        const initialSelectedGenres = {};
        const initialPlatforms = {};
        genreResponse.data.forEach((genre) => {
          initialSelectedGenres[genre._id] = false;
        });
        platformResponse.data.platforms.forEach((platform) => {
          initialPlatforms[platform._id] = false;
        });

        setSelectedGenres(initialSelectedGenres);
        setPlatforms(initialPlatforms);
        console.log(initialSelectedGenres);
        console.log(initialPlatforms);
      } catch (err) {
        console.log("genre fetch error: ", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenres((prev) => ({
      ...prev,
      [genreId]: !prev[genreId],
    }));
  };

  const handlePlatformChange = (platformId) => {
    setPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const genreIds = Object.keys(selectedGenres).filter(
      (id) => selectedGenres[id]
    );
    const actorIds = [];
    console.log(actorsInMovie);
    actorsInMovie.forEach((actor) => actorIds.push(actor._id));
    console.log(actorIds);

    const platformIds = Object.keys(platforms).filter((id) => platforms[id]);

    console.log(genreIds);
    console.log(platformIds);

    const data = new FormData();
    if (file) {
      data.append("image", file);
    }
    data.append("title", formData.title || "Default Title");
    data.append("director", formData.director);
    if (formData.releaseDate) {
      data.append("releaseDate", formData.releaseDate);
    }
    data.append("duration", formData.duration);
    data.append("storyline", formData.storyline);
    data.append("language", formData.language);
    data.append("certificate", formData.certificate);
    data.append("likes", 0);
    data.append("rating", formData.rating);
    data.append("trailer", formData.trailer);
    data.append("isFeatured", formData.isFeatured);
    data.append("isTrending", formData.isTrending);

    data.append("genres", JSON.stringify(genreIds));
    data.append("actors", JSON.stringify(actorIds) || []);
    data.append("platforms", JSON.stringify(platformIds) || []);

    try {
      const response = await api.createMovie(data);
      console.log("Movie created:", response.data);
      navigate("/admin/home");
    } catch (error) {
      console.error("Error creating movie:", error);
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

  if (loading) return <LoadingPage />;

  return (
    <div className="add-movie-page">
      <div className="add-movie-wrapper-wrapper">
        <form onSubmit={handleSubmit} className="add-movie-form-wrapper">
          <div className="add-movie-image-div">
            <label htmlFor="movieImage" className="admin-add-plus-button">
              +
            </label>
            <input
              id="movieImage"
              type="file"
              onChange={handleFileChange}
              className="add-movie-poster-input"
            />
            {file && <p>Selected file: {file.name}</p>}
          </div>

          <div className="add-movie-content-wrapper add-movie-content-wrapper">
            <div className="add-movie-buttons">
              <button
                type="button"
                className="add-movie-cancel-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/admin/home");
                }}
                disabled={submitting}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="add-movie-save-button"
                disabled={submitting}
              >
                {submitting ? "SAVING..." : "SAVE"}
              </button>
            </div>
            <div className="add-movie-content">
              <div className="add-movie-left-div">
                <label htmlFor="title" className="add-movie-label">
                  TITLE *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  className="add-movie-field"
                  required // Client-side validation
                />
                <label htmlFor="releaseDate" className="add-movie-label">
                  RELEASE DATE
                </label>
                <input
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  className="add-movie-field"
                />
                <label htmlFor="language" className="add-movie-label">
                  LANGUAGE
                </label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  value={formData.language}
                  onChange={handleChange}
                  className="add-movie-field"
                />
                <div className="add-movie-label-div add-movie-checkbox-div">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    className="add-movie-field add-movie-checkbox"
                  />
                  <label htmlFor="isFeatured" className="add-movie-label">
                    FEATURED
                  </label>
                </div>
                <div className="add-movie-label-div add-movie-checkbox-div">
                  <input
                    id="isTrending"
                    name="isTrending"
                    type="checkbox"
                    checked={formData.isTrending}
                    onChange={handleChange}
                    className="add-movie-field add-movie-checkbox"
                  />
                  <label htmlFor="isTrending" className="add-movie-label">
                    TRENDING
                  </label>
                </div>
              </div>
              <div className="add-movie-right-div">
                <label htmlFor="director" className="add-movie-label">
                  DIRECTOR
                </label>
                <input
                  id="director"
                  name="director"
                  type="text"
                  value={formData.director}
                  onChange={handleChange}
                  className="add-movie-field"
                />
                <label htmlFor="duration" className="add-movie-label">
                  DURATION (in minutes)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  className="add-movie-field"
                  min="0"
                />
                <label htmlFor="certificate" className="add-movie-label">
                  CERTIFICATE
                </label>
                <select
                  id="certificate"
                  name="certificate"
                  value={formData.certificate}
                  onChange={handleChange}
                  className="add-movie-field"
                >
                  <option value="UA">UA</option>
                  <option value="A">A</option>
                  <option value="U">U</option>
                </select>
                <label htmlFor="rating" className="add-movie-label">
                  RATING (0-10) (will be saved as Likes)
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="add-movie-field"
                />
              </div>
            </div>
            <div className="add-movie-bottom-div">
              <div className="add-movie-bottom-label-div">
                <label htmlFor="trailer">TRAILER URL</label>
                <input
                  id="trailer"
                  name="trailer"
                  type="url"
                  value={formData.trailer}
                  onChange={handleChange}
                  className="add-movie-field add-movie-trailer-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <label className="add-movie-label">GENRES</label>
              <div className="add-movie-genres">
                {allGenres.map((genre) => (
                  <Genre
                    key={genre._id}
                    genre={genre.name}
                    selected={selectedGenres[genre._id] || false}
                    onAdd={() => handleGenreChange(genre._id)}
                  />
                ))}
              </div>
              <label className="add-movie-label">PLATFORMS</label>
              <div className="add-movie-genres">
                {allPlatforms.map((platform) => (
                  <Genre
                    key={platform._id}
                    genre={platform.name}
                    selected={platforms[platform._id] || false}
                    onAdd={() => handlePlatformChange(platform._id)}
                  />
                ))}
              </div>
              <div className="add-movie-tables"></div>
              <div className="add-movie-bottom-label-div">
                <label htmlFor="storyline">STORY LINE</label>
                <textarea
                  id="storyline"
                  name="storyline"
                  rows={4}
                  placeholder="Enter the story line of the movie"
                  value={formData.storyline}
                  onChange={handleChange}
                  className="add-movie-field add-movie-storyline-field"
                />
              </div>
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
                  onClick={() => handleAllActorsSort("name")}
                >
                  Name{" "}
                  {allActorsSortConfig.key === "name"
                    ? allActorsSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAllActors.map((actor, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{actor.name}</td>
                    <td className="table-data">
                      <button
                        className="actor-table-button table-actor-add-button"
                        onClick={() => addToActorsInMovie(actor)}
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
                  onClick={() => handleActorsInMovieSort("name")}
                >
                  Name{" "}
                  {actorsInMovieSortConfig.key === "name"
                    ? actorsInMovieSortConfig.direction === "asc"
                      ? "▲"
                      : "▼"
                    : ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedActorsInMovie.map((actor, index) => {
                return (
                  <tr key={index}>
                    <td className="table-data">{index + 1}</td>
                    <td className="table-data">{actor.name}</td>
                    <td className="table-data">
                      <button
                        className="actor-table-button table-actor-minus-button"
                        onClick={() => removeFromActorsInMovie(actor)}
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

export default AddMovies;
