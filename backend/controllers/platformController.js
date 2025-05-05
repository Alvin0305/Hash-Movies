const Platform = require("../models/Platform");
const Movie = require("../models/Movie");

// Create a new streaming platform
exports.createPlatform = async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if platform already exists
    const existingPlatform = await Platform.findOne({ name });
    if (existingPlatform) {
      return res.status(400).json({ error: "Platform already exists" });
    }

    const platform = new Platform({
      name: req.body.name,
      link: req.body.link,
      logo: req.body.logo,
      supportedRegions: req.body.supportedRegions || [],
    });

    await platform.save();
    
    // Remove version key from response
    const platformResponse = platform.toObject();
    delete platformResponse.__v;
    
    res.status(201).json(platformResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all platforms with optional filtering
exports.getAllPlatforms = async (req, res) => {
  try {
    const { 
      region, 
      hasFreeTier, 
      sort = 'name', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filter = {};
    
    if (region) {
      filter.supportedRegions = { $in: [region] };
    }
    
    if (hasFreeTier === 'true') {
      filter['subscriptionTiers.price'] = 0;
    }

    const platforms = await Platform.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-__v');

    if (platforms.length === 0) {
      return res.status(404).json({ error: "No platforms found" });
    }

    res.json({
      platforms,
      page: parseInt(page),
      totalPages: Math.ceil(await Platform.countDocuments(filter) / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get platform by ID with available movies
exports.getPlatformById = async (req, res) => {
  try {
    const platform = await Platform.findById(req.params.id)
      .select('-__v');
    
    if (!platform) {
      return res.status(404).json({ error: "Platform not found" });
    }

    // Get movies available on this platform
    const movies = await Movie.find({ platforms: platform._id })
      .select('title poster releaseDate')
      .limit(20);

    res.json({
      ...platform.toObject(),
      movies
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update platform information
exports.updatePlatform = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      link: req.body.link,
      logo: req.body.logo,
      supportedRegions: req.body.supportedRegions,
      subscriptionTiers: req.body.subscriptionTiers
    };

    const platform = await Platform.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!platform) {
      return res.status(404).json({ error: "Platform not found" });
    }

    res.json(platform);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a platform and remove references from movies
exports.deletePlatform = async (req, res) => {
  try {
    const platform = await Platform.findByIdAndDelete(req.params.id);
    
    if (!platform) {
      return res.status(404).json({ error: "Platform not found" });
    }

    // Remove platform reference from all movies
    await Movie.updateMany(
      { platforms: platform._id },
      { $pull: { platforms: platform._id } }
    );

    res.json({ message: "Platform deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get movies available on a specific platform
exports.getPlatformMovies = async (req, res) => {
  try {
    const { 
      genre, 
      year, 
      sort = '-releaseDate', 
      page = 1, 
      limit = 10 
    } = req.query;
    
    const filter = { platforms: req.params.id };
    
    if (genre) filter.genres = genre;
    if (year) filter.releaseDate = { 
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)
    };

    const movies = await Movie.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('genres', 'name')
      .populate('actors', 'name')
      .select('-__v');

    const totalCount = await Movie.countDocuments(filter);

    res.json({
      movies,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      totalMovies: totalCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search platforms by name or region
exports.searchPlatforms = async (req, res) => {
  try {
    const { query, region, page = 1, limit = 5 } = req.query;
    
    if (!query && !region) {
      return res.status(400).json({ 
        error: "Must provide either search query or region" 
      });
    }

    const searchFilter = {};
    
    if (query) {
      searchFilter.name = { $regex: query, $options: 'i' };
    }
    
    if (region) {
      searchFilter.supportedRegions = { $in: [region] };
    }

    const platforms = await Platform.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('name logo supportedRegions');

    if (platforms.length === 0) {
      return res.status(404).json({ error: "No platforms found" });
    }

    res.json(platforms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};