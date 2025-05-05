import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const UpdateMovie = () => {
  const location = useLocation();
  const { movie } = location.state || {};

  const [data, setData] = useState({
    title: movie.title,
    director: movie.director,
    releaseDate: new Date(movie.releaseDate),
    duration: movie.duration,
    language: movie.language,
    certificate: movie.certificate,
    isFeatured: movie.isFeatured,
    isTrending: movie.isTrending,
    rating: movie.rating,
  });

  return (
    <div className="update-movie-page">
      <form action="">
        <div className="update-movie-left-div">
          <input
            type="text"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <input
            type="date"
            value={data.releaseDate}
            onChange={(e) =>
              setData((prev) => ({ ...prev, releaseDate: e.target.value }))
            }
          />
          <input
            type="text"
            value={data.language}
            onChange={(e) =>
              setData((prev) => ({ ...prev, language: e.target.value }))
            }
          />
          <input
            type="radio"
            value={data.isFeatured}
            onChange={(e) =>
              setData((prev) => ({ ...prev, isFeatured: e.target.value }))
            }
          />
        </div>
        <div className="update-movie-right-div">
          <input
            type="text"
            value={data.director}
            onChange={(e) =>
              setData((prev) => ({ ...prev, director: e.target.value }))
            }
          />
          <input
            type="text"
            value={data.duration}
            onChange={(e) =>
              setData((prev) => ({ ...prev, duration: e.target.value }))
            }
          />
          <select
            type="text"
            value={data.certificate}
            onChange={(e) =>
              setData((prev) => ({ ...prev, certificate: e.target.value }))
            }
            
          >
            <option value="UA">UA</option>
            <option value="A">A</option>
            <option value="U">U</option>
          </select>
          <input
            type="radio"
            value={data.isTrending}
            onChange={(e) =>
              setData((prev) => ({ ...prev, isTrending: e.target.value }))
            }
          />
        </div>
      </form>
    </div>
  );
};

export default UpdateMovie;
