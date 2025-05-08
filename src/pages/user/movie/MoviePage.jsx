import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../../../api";
import "./movie.css";
import {
  FaStar,
  FaPlus,
  FaHeart,
  FaArrowLeft,
  FaBackspace,
  FaBackward,
  FaEye,
} from "react-icons/fa";
import FlowPane from "../home/utils/FlowPane";
import ScrollPane from "../home/utils/ScrollPane";
import Review from "./components/Review";

const MoviePage = () => {
  const location = useLocation();
  const movie = location.state.movie || {};
  const user = location.state.user || {};
  const navigate = useNavigate();

  const [relatedMovies, setRelatedMovies] = useState([]);
  const [rated, setRated] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [userReview, setUserReview] = useState("");

  useEffect(() => {
    console.log("user in movie page", user);
    const getMovies = async () => {
      try {
        movie.genres.map(async (genre) => {
          const responce = await api.fetchMovies({ genres: genre._id });
          setRelatedMovies(...relatedMovies, responce.data);
        });
      } catch (err) {
        console.log("fetch related movie error:", err.message);
      }
    };

    const getReviews = async () => {
      try {
        const response = await api.fetchReviewsByMovie(movie._id);
        console.log(response.data);
        setReviews(response.data);
      } catch (err) {
        console.log("review fetch error", err.message);
      }
    };
    getMovies();
    getReviews();
  }, []);

  const sendReview = () => {
    const send = async () => {
      try {
        const reviewData = {
          user: user._id,
          movie: movie._id,
          review: userReview,
          rating: 5,
          likes: 0,
          dislikes: 0,
        };
        const response = await api.createReview(reviewData);
        console.log(response.data);
        setReviews([response.data, ...reviews]);
      } catch (err) {
        console.log("review send error: ", err.message);
      }
    };
    send();
  };

  return (
    <div className="movie-page">
      <div className="movie-page-side-bar">
        <button
          className="movie-page-sidebar-back-button"
          onClick={() => {
            navigate("/home", { state: { user: user } });
          }}
        >
          <FaBackward color="white" size={30} />
        </button>
        <h1>{movie.title}</h1>
        <img src={movie.image} alt="No internet" className="movie-page-image" />
        <p className="movie-page-storyline">{movie.storyline}</p>
        <div className="movie-page-sidebar-details">
          <h4 className="movie-page-sidebar-detail">
            {movie.releaseDate.split("T")[0]}
          </h4>
          <h4 className="movie-page-sidebar-detail">&middot;</h4>
          <h4 className="movie-page-sidebar-detail movie-page-sidebar-certificate">
            {movie.certificate}
          </h4>
          <h4 className="movie-page-sidebar-detail">&middot;</h4>
          <h4 className="movie-page-sidebar-detail">
            {Math.floor(movie.duration / 60)}h {Math.floor(movie.duration % 60)}
            m
          </h4>
          <h4 className="movie-page-sidebar-detail">&middot;</h4>
          <h4 className="movie-page-sidebar-detail">{movie.language}</h4>
        </div>
        <div className="movie-page-rating-div">
          {[1, 2, 3, 4, 5].map((num) => {
            if (num <= movie.rating) {
              return <FaStar key={num} color="yellow" size={40} />;
            } else {
              return <FaStar key={num} color="gray" size={40} />;
            }
          })}
        </div>
        <div className="movie-page-genres-div">
          {movie.genres.map((genre, index) => {
            if (movie.genres.length - 1 == index) {
              return (
                <h4 key={index} className="movie-page-sidebar-genre">
                  {genre.name}
                </h4>
              );
            } else {
              return (
                <h4 key={index} className="movie-page-sidebar-genre">
                  {genre.name} |{" "}
                </h4>
              );
            }
          })}
        </div>
      </div>
      <div className="movie-page-content">
        <h2>Actions</h2>
        <div className="movie-page-sidebar-buttons">
          <div>
            <button className="movie-page-sidebar-button movie-page-like-button">
              <div>
                <FaEye size={40} color="white" />
                <h4 className="movie-page-sidebar-button-text">Viewed</h4>
              </div>
            </button>
            <button className="movie-page-sidebar-button">
              <div>
                <FaPlus size={40} color="white" />
                <h4 className="movie-page-sidebar-button-text">WatchList</h4>
              </div>
            </button>
            <button className="movie-page-sidebar-button movie-page-like-button">
              <div>
                <FaHeart size={40} color="white" />
                <h4 className="movie-page-sidebar-button-text">Like</h4>
              </div>
            </button>
          </div>

          <div>
            {[1, 2, 3, 4, 5].map((num, index) => {
              if (index < rated) {
                return (
                  <FaStar
                    size={40}
                    className="selected-star"
                    onClick={() => setRated(num)}
                    key={index}
                  />
                );
              } else {
                return (
                  <FaStar
                    size={40}
                    className="unselected-star"
                    onClick={() => setRated(num)}
                    key={index}
                  />
                );
              }
            })}
          </div>
        </div>
        <h1>More Like this</h1>
        {/* <FlowPane movies={relatedMovies} user={user}/> */}
        <ScrollPane movies={relatedMovies} user={user} />
        <div className="movie-page-review-session">
          <h2>REVIEW SESSION</h2>
          <form action="" className="movie-review-form">
            <input
              type="text"
              value={userReview}
              placeholder="Type your review"
              onChange={(e) => setUserReview(e.target.value)}
              className="movie-review-field"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                sendReview();
              }}
              className="movie-review-send-button"
            >
              SEND
            </button>
          </form>
          {reviews.map((review, index) => (
            <Review key={index} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
