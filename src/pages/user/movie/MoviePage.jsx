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
  FaCross,
  FaTimes,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import FlowPane from "../home/utils/FlowPane";
import ScrollPane from "../home/utils/ScrollPane";
import Review from "./components/Review";
import ActorsScrollPane from "../home/utils/ActorsScrollPane";
import { useUser } from "../../../context/UserContext";

const MoviePage = () => {
  const location = useLocation();
  const movie = location.state.movie || {};
  const navigate = useNavigate();
  const actors = movie.actors || [];

  const [relatedMovies, setRelatedMovies] = useState([]);
  const [rated, setRated] = useState(0);
  const [reviews, setReviews] = useState([]);

  const { user } = useUser();

  const [userReview, setUserReview] = useState("");

  useEffect(() => {
    console.log("user in movie page", user);
    const getMovies = async () => {
      try {
        const genreIds = [];
        movie.genres.forEach((genre) => genreIds.push(genre._id));
        const response = await api.fetchMovies({
          genres: genreIds,
          matchType: "or",
        });
        console.log(response.data);
        const filteredFilms = response.data.filter(
          (mov) => movie._id !== mov._id
        );
        setRelatedMovies(filteredFilms);
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
  }, [movie]);

  const checkViewed = () => {
    return Array.isArray(user?.viewed) && user.viewed.includes(movie._id);
  };

  const checkLiked = () => {
    return Array.isArray(user?.liked) && user.liked.includes(movie._id);
  };

  const checkWatchList = () => {
    return Array.isArray(user?.watchList) && user.watchList.includes(movie._id);
  };

  const [isViewed, setIsViewed] = useState(checkViewed());
  const [isLiked, setIsLiked] = useState(checkLiked());
  const [isInWatchList, setIsInWatchList] = useState(checkWatchList());

  const addToViewed = async () => {
    console.log("adding");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.addToViewed(user._id, details);
      console.log("response data", response.data);
      setIsViewed(true);
      user.viewed = response.data.viewed;
    } catch (err) {
      console.log("add to view error:", err.message);
    }
  };

  const removeFromViewed = async () => {
    console.log("removing");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.removeFromViewed(user._id, details);
      console.log("response data", response.data);
      setIsViewed(false);
      user.viewed = response.data.viewed;
    } catch (err) {
      console.log("add to view error:", err.message);
    }
  };

  const handleViewButton = () => {
    if (user.viewed.includes(movie._id)) {
      removeFromViewed();
    } else {
      addToViewed();
    }
  };

  const removeFromLiked = async () => {
    console.log("removing");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.removeFromLiked(user._id, details);
      console.log("response data", response.data);
      setIsLiked(false);
      user.liked = response.data.liked;
    } catch (err) {
      console.log("add to like error:", err.message);
    }
  };

  const addToLiked = async () => {
    console.log("adding");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.addToLiked(user._id, details);
      console.log("response data", response.data);
      setIsLiked(true);
      user.liked = response.data.liked;
    } catch (err) {
      console.log("add to like error:", err.message);
    }
  };

  const handleLikeButton = async () => {
    console.log("like button pressed");
    if (user.liked.includes(movie._id)) {
      removeFromLiked();
      try {
        const response = await api.unlikeMovie(movie._id);
        console.log(response.data);
      } catch (err) {
        console.log("unlike error", err.message);
      }
    } else {
      addToLiked();
      try {
        const response = await api.likeMovie(movie._id);
        console.log(response.data);
      } catch (err) {
        console.log("like error", err.message);
      }
    }
  };

  const removeFromWatchList = async () => {
    console.log("removing");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.removeFromWatchList(user._id, details);
      console.log("response data", response.data);
      setIsInWatchList(false);
      user.watchList = response.data.watchList;
    } catch (err) {
      console.log("add to like error:", err.message);
    }
  };

  const addToWatchList = async () => {
    console.log("adding");
    try {
      const details = {
        movieId: movie._id,
      };
      console.log(details);
      const response = await api.addToWatchList(user._id, details);
      console.log("response data", response.data);
      setIsInWatchList(true);
      user.watchList = response.data.watchList;
    } catch (err) {
      console.log("add to like error:", err.message);
    }
  };

  const handleWatchListButton = () => {
    if (user.watchList.includes(movie._id)) {
      removeFromWatchList();
    } else {
      addToWatchList();
    }
  };

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
        setUserReview("");
      } catch (err) {
        console.log("review send error: ", err.message);
      }
    };
    send();
  };

  const deleteReview = (rev) => {
    const deleteRev = async (rev) => {
      try {
        console.log("review", rev);
        const response = await api.deleteReview(rev._id);
        console.log("response.data: ", response.data);
        setReviews(reviews.filter((review) => review._id !== rev._id));
      } catch (err) {
        console.log("delete review error", err.message);
      }
    };
    deleteRev(rev);
  };

  const convertToEmbedUrl = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    console.log(
      "new url",
      match ? `https://www.youtube.com/embed/${match[1]}` : ""
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  return (
    <div className="movie-page">
      <div className="movie-page-side-bar">
        <FaArrowLeft
          size={30}
          onClick={() => navigate("/home")}
          className="movie-page-sidebar-back-button"
        />
        <h1 className="movie-page-title">{movie.title}</h1>
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
        <div className="movie-page-action-buttons">
          <button className="movie-page-sidebar-button movie-page-like-button">
            <div onClick={handleViewButton}>
              <FaEye size={20} color={isViewed ? "green" : "white"} />
              <h4 className="movie-page-sidebar-button-text">Viewed</h4>
            </div>
          </button>
          <button className="movie-page-sidebar-button">
            <div onClick={handleWatchListButton}>
              <FaPlus size={20} color={isInWatchList ? "green" : "white"} />
              <h4 className="movie-page-sidebar-button-text">WatchList</h4>
            </div>
          </button>
          <button className="movie-page-sidebar-button movie-page-like-button">
            <div onClick={handleLikeButton}>
              <FaHeart size={20} color={isLiked ? "green" : "white"} />
              <h4 className="movie-page-sidebar-button-text">Like</h4>
            </div>
          </button>
        </div>
      </div>
      <div className="movie-page-content">
        {movie.trailer !== "" && (
          <div className="trailer-wrapper">
            <iframe
              src={convertToEmbedUrl(movie.trailer)}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <h1>MORE LIKE THIS</h1>
        <ScrollPane movies={relatedMovies} />
        <h1>ACTORS</h1>
        <ActorsScrollPane actors={actors} />
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
          <div className="reviews-div">
            {reviews.map((review, index) => (
              <div key={index} className="review-div">
                <Review review={review} />
                {review.user._id === user._id && (
                  <button
                    onClick={() => deleteReview(review)}
                    className="review-delete-button"
                  >
                    <FaTimes size={20} color="red" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
