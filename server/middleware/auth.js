const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('No token');
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send('Invalid token');
  }
};