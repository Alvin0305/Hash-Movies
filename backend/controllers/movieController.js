const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Platform = require("../models/Platform");
const Actor = require("../models/Actor");
const cloudinary = require("../config/cloudinaryConfig");

exports.getAllMovies = async (req, res) => {
  try {
    console.log("getting movies");
    const {
      isFeatured,
      isTrending,
      genre,
      genres,
      "genres[]": genresArray,
      actor,
      platform,
      platforms,
      "platforms[]": platformsArray,
      title,
      language,
    } = req.query;
    const filter = {};

    const matchType = req.query.matchType || "and";

    console.log(req.query);

    if (isTrending) filter.isTrending = isTrending === "true";
    if (isFeatured) filter.isFeatured = isFeatured === "true";
    if (genre) filter.genres = genre;
    const finalGenres = genres || genresArray;
    if (finalGenres) {
      const genreList = Array.isArray(finalGenres)
        ? finalGenres
        : finalGenres.split(",").map((g) => g.trim());
      if (matchType === "or") {
        filter.genres = { $in: genreList };
      } else {
        filter.genres = { $all: genreList };
      }
    }
    if (actor) filter.actors = actor;
    if (platform) filter.platform = platform;
    const finalPlatforms = platforms || platformsArray;
    if (finalPlatforms) {
      const platformList = Array.isArray(finalPlatforms)
        ? finalPlatforms
        : finalPlatforms.split(",").map((g) => g.trim());
      if (matchType === "or") {
        filter.platforms = { $in: platformList };
      } else {
        filter.platforms = { $all: platformList };
      }
    }
    if (title) filter.title = { $regex: title, $options: "i" };
    if (language) filter.language = language;

    console.log("filters: ", filter);

    const movies = await Movie.find(filter)
      .populate("genres")
      .populate("actors")
      .populate("platforms");
    if (!movies) res.status(404).json({ error: "No movies found" });
    console.log(movies);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieByGenre = async (req, res) => {
  console.log("fetching movie by genre");
  try {
    const movies = await Movie.find({ genres: req.params.id })
      .populate("genres")
      .populate("actors");
    if (!movies) res.status(404).json({ error: "No movie in that genre" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const movieData = {
      title: req.body.title,
      director: req.body.director,
      releaseDate: req.body.releaseDate,
      genres: JSON.parse(req.body.genres || "[]"),
      actors: JSON.parse(req.body.actors || "[]"),
      duration: req.body.duration,
      storyline: req.body.storyline,
      language: req.body.language,
      certificate: req.body.certificate,
      likes: req.body.likes,
      platforms: JSON.parse(req.body.platforms || "[]"),
      trailer: req.body.trailer,
      isFeatured: req.body.isFeatured,
      isTrending: req.body.isTrending,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "hashmovies/movies", // Optional: organize in Cloudinary folders
          // public_id: `movie_${Date.now()}`, // Optional: custom public_id
          resource_type: "image",
        }
      );
      movieData.image = result.secure_url; // Store the Cloudinary URL
      movieData.cloudinaryPublicId = result.public_id; // Optional: store public_id for deletion/updates
    } else {
      // Provide a default image URL (perhaps one you upload to Cloudinary manually)
      movieData.image =
        "https://res.cloudinary.com/duki8udfb/image/upload/vXXXXXX/hashmovies/defaults/default-movie.jpg"; // Replace with your actual default URL
    }

    const movie = new Movie(movieData);
    await movie.save();

    res.status(201).json(movie);
  } catch (err) {
    console.error("Full error in createMovie:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message, details: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate("genres")
      .populate("actors")
      .populate("platforms");
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("genres")
      .populate("actors")
      .populate("platforms");
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    await Actor.updateMany(
      { films: movie._id },
      { $pull: { mostFamousMovies: movie._id } }
    );

    res.json({ message: "Movie succesfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likeMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlikeMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    if (!movie) res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isFeatured: true })
      .populate("genres")
      .populate("actors");
    if (!movies) return res.status(404).json({ error: "No featured movies" });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
