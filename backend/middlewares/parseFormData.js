exports.parseFormData = (req, res, next) => {
    // Convert string 'true'/'false' to boolean
    if (req.body.isFeatured) req.body.isFeatured = req.body.isFeatured === 'true';
    if (req.body.isTrending) req.body.isTrending = req.body.isTrending === 'true';
    
    // Convert string numbers to actual numbers
    if (req.body.duration) req.body.duration = Number(req.body.duration);
    if (req.body.likes) req.body.likes = Number(req.body.likes);
    
    next();
  };