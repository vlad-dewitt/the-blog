const config = require('config');
const webToken = require('jsonwebtoken');



module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[0]

    if (!token) {
      res.status(401).json({ message: "Authorization Failed" })
    }
    
    const decoded = webToken.verify(token, config.get('auth_secret'));

    req.user = decoded;
    next()
  } catch (err) {
    res.status(401).json({ message: "Authorization Failed" })
  }
}
