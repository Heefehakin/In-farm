exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Please login to continue' });
  };
  
  exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ROLE_ADMIN') {
      return next();
    }
    res.status(403).json({ error: 'Admin access required' });
  };