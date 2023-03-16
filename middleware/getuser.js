const jwt = require("jsonwebtoken");

//require to import the env files variables
require("dotenv").config();

const secretKEy = process.env.SECRET_KEY;

module.exports = function getuser(req, res, next) {
  // Get user id from the jwt token and add it to req object
  const token = req.header("jwt-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }

  try {
    const data = jwt.verify(token, secretKEy);
    console.log(data);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid jwt token." });
  }
};
