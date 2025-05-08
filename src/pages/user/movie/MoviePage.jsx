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

const MoviePage = () => {
  const location = useLocation();
  const movie = location.state.movie || {};
  const user = location.state.user || {};
  const navigate = useNavigate();
  const actors = movie.actors || [];

  const [relatedMovies, setRelatedMovies] = useState([]);
  const [rated, setRated] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [userReview, setUserReview] = useState("");

  const [isViewed, setIsViewed] = useState(user.viewed.includes(movie._id));
  const [isLiked, setIsLiked] = useState(user.liked.includes(movie._id));
  const [isInWatchList, setIsInWatchList] = useState(
    user.watchList.includes(movie._id)
  );

  useEffect(() => {
    console.log("user in movie page", user);
    console.log(user.viewed);
    console.log(movie._id);
    console.log(user.viewed.includes(movie._id));
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

  const handleLikeButton = () => {
    console.log("like button pressed");
    if (user.liked.includes(movie._id)) {
      removeFromLiked();
    } else {
      addToLiked();
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

  const likeReview = (rev) => {
    const like = async (rev) => {
      try {
        const reviewData = {
          user: rev.user._id,
          movie: rev.movie._id,
          review: rev.review,
          likes: rev.likes + 1,
          dislikes: rev.dislikes,
          rating: rev.rating,
        };
        const response = await api.updateReview(rev._id, reviewData);
        console.log(response);
      } catch (err) {
        console.log("like review error", err.message);
      }
    };
    like(rev);
  };

  const dislikeReview = (rev) => {
    const dislike = async (rev) => {
      try {
        const reviewData = {
          user: rev.user._id,
          movie: rev.movie._id,
          review: rev.review,
          likes: rev.likes,
          dislikes: rev.dislikes + 1,
          rating: rev.rating,
        };
        const response = await api.updateReview(rev._id, reviewData);
        console.log(response);
        setReviews((prevReviews) => {
          prevReviews.map((r) =>
            r._id === rev._id ? { ...r, dislikes: r.dislikes + 1 } : r
          );
        });
      } catch (err) {
        console.log("dislike review error", err.message);
      }
    };
    dislike(rev);
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
        <img src={`/backend/${movie.image}`} alt="No internet" className="movie-page-image" />
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
              <div onClick={handleViewButton}>
                <FaEye size={40} color={isViewed ? "green" : "white"} />
                <h4 className="movie-page-sidebar-button-text">Viewed</h4>
              </div>
            </button>
            <button className="movie-page-sidebar-button">
              <div onClick={handleWatchListButton}>
                <FaPlus size={40} color={isInWatchList ? "green" : "white"} />
                <h4 className="movie-page-sidebar-button-text">WatchList</h4>
              </div>
            </button>
            <button className="movie-page-sidebar-button movie-page-like-button">
              <div onClick={handleLikeButton}>
                <FaHeart size={40} color={isLiked ? "green" : "white"} />
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
        <ScrollPane movies={relatedMovies} user={user} />
        <h1>Actors</h1>
        <ActorsScrollPane actors={actors} user={user}/>
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
                <div className="review-buttons">
                  <div className="review-button-value">
                    <button
                      className="review-button"
                      onClick={() => likeReview(review)}
                    >
                      <FaThumbsUp />
                    </button>
                    <h5 className="review-value">{review.likes}</h5>
                  </div>
                  <div className="review-button-value">
                    <button
                      className="review-button"
                      onClick={() => dislikeReview(review)}
                    >
                      <FaThumbsDown />
                    </button>
                    <h5 className="review-value">{review.dislikes}</h5>
                  </div>

                  {review.user._id === user._id && (
                    <button
                      onClick={() => deleteReview(review)}
                      className="review-delete-button"
                    >
                      <FaTimes size={20} color="red" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
