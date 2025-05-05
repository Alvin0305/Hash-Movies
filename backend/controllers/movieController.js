const Movie = require("../models/Movie");
const Genre = require("../models/Genre");
const Platform = require("../models/Platform");
const Actor = require("../models/Actor");

exports.getAllMovies = async (req, res) => {
  try {
    const { isFeatured, isTrending, genre, actor, platform, title, language } = req.query;
    const filter = {};

    if (isTrending) filter.isTrending = isTrending === "true";
    if (isFeatured) filter.isFeatured = isFeatured === "true";
    if (genre) filter.genres = genre;
    if (actor) filter.actors = actor;
    if (platform) filter.platform = platform;
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
  try {
    const movies = await Movie.find({ genres: req.params.genreId })
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
    const movie = new Movie(req.body);
    await movie.save();

    if (movie.actors && movie.actors.length > 0) {
      await Actor.updateMany(
        { _id: { $in: req.body.actors } },
        { $addToSet: { films: movie._id } }
      );
    }

    if (movie.genres && movie.genres.length > 0) {
      await Genre.updateMany(
        { _id: { $in: req.body.genres } },
        { $addToSet: { movies: movie._id } }
      );
    }
    res.status(201).json(movie);
  } catch (err) {
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
      { $pull: { films: movie._id, mostFamousMovies: movie._id } }
    );

    await Genre.updateMany(
      { movies: movie._id },
      { $pull: { movies: movie._id } }
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
