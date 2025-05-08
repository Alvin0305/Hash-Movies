const Actor = require("../models/Actor");
const Movie = require("../models/Movie");

exports.createActor = async (req, res) => {
  try {
    const { name } = req.body;
    const existingActor = await Actor.findOne({ name });
    if (existingActor)
      return res.status(400).json({ error: "Actor already exists" });

    const actor = new Actor(req.body);
    await actor.save();

    if (req.body.debutMovie) {
      await Movie.findByIdAndUpdate(req.body.debutMovie, {
        $addToSet: { actors: actor._id },
      });
    }
    res.status(201).json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllActors = async (req, res) => {
  try {
    const {
      minMovies, 
      sort = "-createdAt",
      limit = 20,
      language,
    } = req.query;

    let filterCriteria = {}; 

    if (language) {
      filterCriteria.languages = language;
    }

    let query = Actor.find(filterCriteria); 

    query = query.sort(sort);

    query = query.limit(parseInt(limit));

    const actors = await query
      .populate("debutMovie")
      .populate("mostFamousMovies")
      .populate("films");

    res.json(actors);
  } catch (err) {
    console.error("ERROR in getAllActors:", err);
    res.status(500).json({ error: "An internal server error occurred while fetching actors." }); // Provide a generic message to the client
  }
};

exports.getActorById = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id)
      .populate("debutMovie")
      .populate("mostFamousMovies")
      .populate("films");
    if (!actor) return res.status(404).json({ error: "Actor not found" });
    res.json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateActor = async (req, res) => {
  try {
    const { debutMovie, mostFamousMovies } = req.body;
    const updates = { ...req.body };

    // Handle debut movie change
    if (debutMovie) {
      const actor = await Actor.findById(req.params.id);
      if (actor.debutMovie && actor.debutMovie.toString() !== debutMovie) {
        // Remove from old debut movie's actors
        await Movie.findByIdAndUpdate(actor.debutMovie, {
          $pull: { actors: req.params.id },
        });
      }
      // Add to new debut movie's actors
      await Movie.findByIdAndUpdate(debutMovie, {
        $addToSet: { actors: req.params.id },
      });
    }

    // Handle most famous movies update
    if (mostFamousMovies && Array.isArray(mostFamousMovies)) {
      updates.mostFamousMovies = mostFamousMovies;
    }

    const updatedActor = await Actor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("debutMovie", "title")
      .populate("mostFamousMovies", "title");

    if (!updatedActor) {
      return res.status(404).json({ error: "Actor not found" });
    }

    res.json(updatedActor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteActor = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndDelete(req.params.id);
    if (!actor) return res.status(404).json({ error: "Actor not found" });

    await Movie.updateMany(
      { actors: actor._id },
      { $pull: { actors: actor._id } }
    );

    res.json({ message: "Actor deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getActorMovies = async (req, res) => {
  try {
    const { sort = "-releaseDate", limit = 10 } = req.query;
    const movies = await Movie.find({ actors: req.params.id })
      .sort(sort)
      .limit(parseInt(limit));
    res.json(movies);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.searchActor = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2)
      return res
        .status(400)
        .json({ error: "Search query must contain atleast 2 characters" });
    const actors = await Actor.find({
      name: { $regex: query, $options: "i" },
    });
    if (actors.length == 0)
      return res.status(404).json({ error: "Actor not found" });
    res.json(actors);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
