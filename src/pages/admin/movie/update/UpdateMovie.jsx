import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./update.css";
import * as api from "../../../../api";
import LoadingPage from "../../../user/loading/LoadingPage";
import Genre from "../../../user/user/components/Genre";

const UpdateMovie = () => {
  const location = useLocation();
  const { movie } = location.state || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const navigate = useNavigate();

  const [data, setData] = useState({
    title: movie.title,
    director: movie.director,
    releaseDate: formatDate(movie.releaseDate),
    duration: movie.duration,
    language: movie.language,
    certificate: movie.certificate || "UA",
    isFeatured: movie.isFeatured,
    isTrending: movie.isTrending,
    rating: movie.rating || 0,
    trailer: movie.trailer,
    storyline: movie.storyline,
  });

  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState([]);
  const [genres, setGenres] = useState({});
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

  useEffect(() => {
    const fetchAllGenresAndPlatforms = async () => {
      try {
        const [genreResponse, platformResponse, actorResponse] =
          await Promise.all([
            api.fetchGenres(),
            api.fetchPlatforms(),
            api.fetchActors(),
          ]);
        console.log("genre response: ", genreResponse);
        console.log("platform response: ", platformResponse);
        console.log("actor response", actorResponse.data);
        setAllGenres(genreResponse.data);
        setAllPlatforms(platformResponse.data.platforms);
        setAllActors(actorResponse.data);

        const initialGenres = {};
        const initialPlatforms = {};
        const initialActors = [];
        const allActorList = [];
        genreResponse.data.forEach((genre) => {
          initialGenres[genre._id] = movie.genres.some(
            (g) => g._id === genre._id
          );
        });
        platformResponse.data.platforms.forEach((platform) => {
          initialPlatforms[platform._id] = movie.platforms.some(
            (p) => p._id === platform._id
          );
        });
        actorResponse.data.forEach((actor) => {
          let flag = 0;
          movie.actors.forEach((movieActor) => {
            if (movieActor._id === actor._id) {
              initialActors.push(actor);
              flag = 1;
            }
          });
          if (flag === 0) {
            allActorList.push(actor);
          }
        });
        console.log(movie.actors);
        console.log(initialActors);
        console.log(allActorList);

        setGenres(initialGenres);
        setPlatforms(initialPlatforms);
        setActorsInMovie(initialActors);
        setAllActors(allActorList);
        setLoading(false);
        console.log(genres);
      } catch (err) {
        console.log("genre fetch error: ", err.message);
      }
    };
    fetchAllGenresAndPlatforms();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      try {
        const genreIds = [];
        const platformIds = [];
        const actorIds = [];
        for (const id in genres) {
          if (genres[id]) {
            genreIds.push(id);
          }
        }
        for (const id in platforms) {
          if (platforms[id]) {
            platformIds.push(id);
          }
        }
        for (const id of actorsInMovie) {
          actorIds.push(id);
        }

        console.log(genreIds);
        console.log(platformIds);
        console.log(actorIds);

        const movieData = {
          _id: movie._id,
          title: data.title,
          director: data.director,
          releaseDate: data.releaseDate,
          genres: genreIds,
          image: movie.image,
          actors: actorIds,
          duration: data.duration,
          language: data.language,
          certificate: data.certificate,
          isFeatured: data.isFeatured,
          isTrending: data.isTrending,
          rating: Number(data.rating),
          trailer: data.trailer,
          storyline: data.storyline,
          platforms: platformIds,
        };
        const response = await api.updateMovie(movie._id, movieData);
        console.log(response.data);

        navigate("/admin/home");
      } catch (err) {
        console.log("movie update error", err);
      }
    };
    save();
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="update-movie-page">
      <div className="update-movie-wrapper">
        <form className="update-movie-page-wrapper">
          <div className="update-movie-image-div">
            <img
              src={`${movie.image}`}
              alt="No internet"
              width={300}
              className="update-movie-image"
            />
          </div>
          <div className="update-movie-content-wrapper">
            <div className="update-movie-content">
              <div className="update-movie-left-div">
                <label htmlFor="Title" className="update-movie-label">
                  TITLE
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="update-movie-field"
                />
                <label htmlFor="Release Date" className="update-movie-label">
                  RELEASE DATE
                </label>
                <input
                  type="date"
                  value={data.releaseDate}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      releaseDate: e.target.value,
                    }))
                  }
                  className="update-movie-field"
                />
                <label htmlFor="Language" className="update-movie-label">
                  LANGUAGE
                </label>
                <input
                  type="text"
                  value={data.language}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, language: e.target.value }))
                  }
                  className="update-movie-field"
                />
                <div className="update-movie-label-div update-movie-checkbox-div">
                  <input
                    type="checkbox"
                    checked={data.isFeatured}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    className="update-movie-field update-movie-checkbox"
                  />
                  <label htmlFor="Featured" className="update-movie-label">
                    FEATURED
                  </label>
                </div>
                <div className="update-movie-label-div update-movie-checkbox-div">
                  <input
                    type="checkbox"
                    checked={data.isTrending}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        isTrending: e.target.checked,
                      }))
                    }
                    className="update-movie-field update-movie-checkbox"
                  />
                  <label htmlFor="Trending" className="update-movie-label">
                    TRENDING
                  </label>
                </div>
              </div>
              <div className="update-movie-right-div">
                <label htmlFor="Director" className="update-movie-label">
                  DIRECTOR
                </label>
                <input
                  type="text"
                  value={data.director}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, director: e.target.value }))
                  }
                  className="update-movie-field"
                />
                <label htmlFor="Duration" className="update-movie-label">
                  DURATION (in minutes)
                </label>
                <input
                  type="text"
                  value={data.duration}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, duration: e.target.value }))
                  }
                  className="update-movie-field"
                />
                <label htmlFor="Certificate" className="update-movie-label">
                  CERTIFICATE
                </label>
                <select
                  type="text"
                  value={data.certificate}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      certificate: e.target.value,
                    }))
                  }
                  className="update-movie-field"
                >
                  <option value="UA">UA</option>
                  <option value="A">A</option>
                  <option value="U">U</option>
                </select>
                <label htmlFor="Rating" className="update-movie-label">
                  RATING
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={data.rating}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, rating: e.target.value }))
                  }
                  className="update-movie-field"
                />
              </div>
            </div>
            <div className="update-movie-bottom-div">
              <div className="update-movie-bottom-label-div">
                <label htmlFor="Trailer">TRAILER</label>
                <input
                  type="text"
                  value={data.trailer}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, trailer: e.target.value }))
                  }
                  className="update-movie-field update-movie-trailer-field"
                />
              </div>
              <label htmlFor="Genres" className="update-movie-label">
                GENRES
              </label>
              <div className="update-movie-genres">
                {allGenres.map((genre) => (
                  <Genre
                    genre={genre.name}
                    onAdd={() => {
                      setGenres((prev) => ({
                        ...prev,
                        [genre._id]: !prev[genre._id],
                      }));
                    }}
                    key={genre._id}
                    selected={genres[genre._id] || false}
                  />
                ))}
              </div>
              <label
                htmlFor="Platforms"
                className="update-movie-label update-platform-label"
              >
                PLATFORMS
              </label>
              <div className="update-movie-genres">
                {allPlatforms.map((platform) => (
                  <Genre
                    genre={platform.name}
                    onAdd={() => {
                      setPlatforms((prev) => ({
                        ...prev,
                        [platform._id]: !prev[platform._id],
                      }));
                    }}
                    key={platform._id}
                    selected={platforms[platform._id] || false}
                  />
                ))}
              </div>
              <div className="update-movie-bottom-label-div">
                <label
                  htmlFor="Story Line"
                  className="update-movie-label update-storyline-label"
                >
                  STORY LINE
                </label>
                <textarea
                  id="storyline"
                  type="text"
                  rows={4}
                  placeholder="Enter the story line of the story"
                  value={data.storyline}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, storyline: e.target.value }))
                  }
                  className="update-movie-field update-movie-storyline-field"
                />
              </div>
              <div className="update-movie-buttons">
                <button
                  className="update-movie-cancel-button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/admin/home");
                  }}
                >
                  CANCEL
                </button>
                <button
                  className="update-movie-save-button"
                  onClick={(e) => handleSave(e)}
                >
                  SAVE
                </button>
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

export default UpdateMovie;
