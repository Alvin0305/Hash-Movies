import React, { useEffect, useState } from "react";
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
    rating: movie.rating,
    trailer: movie.trailer,
    storyline: movie.storyline,
  });

  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState([]);
  const [genres, setGenres] = useState({});

  useEffect(() => {
    const fetchAllGenres = async () => {
      try {
        const response = await api.fetchGenres();
        setAllGenres(response.data);

        const initialGenres = {};
        response.data.forEach((genre) => {
          initialGenres[genre._id] = movie.genres.some(
            (g) => g._id === genre._id
          );
        });

        setGenres(initialGenres);
        setLoading(false);
        console.log(genres);
      } catch (err) {
        console.log("genre fetch error: ", err.message);
      }
    };
    fetchAllGenres();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      try {
        const genreIds = [];
        for (const id in genres) {
          if (genres[id]) {
            genreIds.push(id);
          }
        }

        console.log(genreIds);

        const movieData = {
          _id: movie._id,
          title: data.title,
          director: data.director,
          releaseDate: data.releaseDate,
          genres: genreIds,
          image: movie.image,
          actors: movie.actors,
          duration: data.duration,
          language: data.language,
          certificate: data.certificate,
          isFeatured: data.isFeatured,
          isTrending: data.isTrending,
          rating: Number(data.rating),
          trailer: data.trailer,
          storyline: data.storyline,
        };
        const response = await api.updateMovie(movie._id, movieData);
        console.log(response.data);

        navigate(-1);
      } catch (err) {
        console.log("movie update error", err);
      }
    };
    save();
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="update-movie-page">
      <form className="update-movie-page-wrapper">
        <div className="update-movie-image-div">
          <img
            src={`/backend/${movie.image}`}
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
                  setData((prev) => ({ ...prev, releaseDate: e.target.value }))
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
                  setData((prev) => ({ ...prev, certificate: e.target.value }))
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
            <div className="update-movie-bottom-label-div">
              <label htmlFor="Story Line">STORY LINE</label>
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
                  navigate(-1);
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
    </div>
  );
};

export default UpdateMovie;
