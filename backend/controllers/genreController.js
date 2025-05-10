const Genre = require("../models/Genre");
const Movie = require("../models/Movie");

exports.createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const existingGenre = await Genre.findOne({ name });
    if (existingGenre)
      return res.status(400).json({ error: "Genre already exists" });

    const genreData = {
      name: req.body.name,
      description: req.body.description,
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`,
        {
          folder: "hashmovies/genres",
          resource_type: "image",
        }
      );
      genreData.image = result.secure_url;
      genreData.cloudinaryPublicId = result.public_id;
    } else {
      genreData.image =
        "https://res.cloudinary.com/duki8udfb/image/upload/vXXXXXX/hashmovies/defaults/default-genre.jpg"; // Replace with your actual default URL
    }

    const genre = new Genre(genreData);
    await genre.save();
    res.status(201).json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    if (genres.length === 0)
      return res.status(404).json({ error: "No genres" });
    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGenreById = async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!genre) return res.status(404).json({ error: "Genre not found" });
    res.json(genre);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    if (!genre) return res.status(404).json({ error: "Genre not found" });

    await Movie.updateMany(
      { genres: genre._id },
      { $pull: { genres: genre._id } }
    );

    res.json({ message: "Genre successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
