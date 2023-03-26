const jwt = require("jsonwebtoken");

// some methods to import the env files variables
const path = require('path');
//require("dotenv").config();
// require("dotenv").config({path: path.resolve(__dirname, '../.env')});
require("dotenv").config({path:__dirname+'/./../.env'});

const secretKEy = process.env.SECRET_KEY;

const getuser = (req, res, next) => {
  // Get user id from the jwt token and add it to req object
  const token = req.header("jwt-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }

  try {
    // comparing the token with the Secret key
    const data = jwt.verify(token, secretKEy);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }
};


module.exports = getuser;