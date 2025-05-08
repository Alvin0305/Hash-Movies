const Review = require("../models/Review");
const Movie = require("../models/Movie");
const User = require("../models/User");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { movie, user, review, rating } = req.body;
    console.log("creating review");

    if (rating < 0 || rating > 10) {
      console.log("rating must be between 0 and 10");
      return res.status(400).json({ error: "Rating must be between 0 and 10" });
    }

    const movieExists = await Movie.findById(movie);
    if (!movieExists) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const userExists = await User.findById(user);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const newReview = new Review({
      movie,
      user,
      review,
      rating,
      likes: 0,
      dislikes: 0,
    });

    const responseReview = {
      movie: movie,
      user: userExists,
      review: review,
      rating: rating,
      likes: 0,
      dislikes: 0,
    };

    console.log("newReview", responseReview);

    await newReview.save();

    await updateMovieRating(movie);

    res.status(201).json(responseReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const reviews = await Review.find()
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name avatar")
      .populate("movie", "title poster");

    const count = await Review.countDocuments();

    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews for a specific movie
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const reviews = await Review.find({ movie: req.params.movieId })
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .populate("user")
      .populate("movie");

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this movie" });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews by a specific user
exports.getReviewsByUser = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .populate("movie", "title poster year")
      .select("-__v");

    if (reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this user" });
    }

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name avatar")
      .populate("movie", "title poster");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { review, rating } = req.body;

    if (rating && (rating < 0 || rating > 10)) {
      return res.status(400).json({ error: "Rating must be between 0 and 10" });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { review, rating },
      { new: true, runValidators: true }
    ).populate("user", "name");

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update movie's average rating
    await updateMovieRating(updatedReview.movie);

    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update movie's average rating
    await updateMovieRating(review.movie);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Like/Dislike a review
exports.reactToReview = async (req, res) => {
  try {
    const { action } = req.params; // 'like' or 'dislike'
    const updateField = action === "like" ? "likes" : "dislikes";

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to update movie's average rating
async function updateMovieRating(movieId) {
  const result = await Review.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: result[0].averageRating.toFixed(1),
      reviewCount: result[0].reviewCount,
    });
  } else {
    await Movie.findByIdAndUpdate(movieId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
}
