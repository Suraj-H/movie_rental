module.exports = function (req, res, next) {
  // 401 Unauthorized
  if (!req.user) {
    return res.status(401).send('Access denied. No token provided.');
  }

  // 403 Forbidden
  if (!req.user.isAdmin) {
    return res.status(403).send('Access denied. User is not an admin.');
  }

  next();
};
