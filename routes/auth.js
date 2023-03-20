const express = require('express');
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getuser = require('../middleware/getuser');
//require to import the env files variables
require("dotenv").config();


const secretKEy = process.env.SECRET_KEY;

// route1 create user using POST "/api/auth/createuser" No login required
router.post('/createuser', [
  body("name", "Please enter valid name").isLength({ min: 3 }),
  body("email", "Please enter unique email").isEmail(),
  body("password", "password above 5 character").isLength({ min: 5 })
], async (req, res) => {
  //return function return error if there is a error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //error handling with try catch
  try {
    //check wheather the email (email schema define unique) value exist already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" });
    }

    // hashing password for security reasons
    //creating a salt
    const salt = await bcrypt.genSalt(10);
    //creating a hash password
    const password = await bcrypt.hash(req.body.password, salt);

    //Create a new User
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: password
    })

    //creating json web token
    const data = {
      user: {
        id: user.id
      }
    }
    const jwtAuth = jwt.sign(data, secretKEy);
    res.json({ jwtAuth });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error");
  }

});



// route2 create login using POST "/api/auth/login" No login required
router.post('/login', [
  body("email", "Please enter unique email").isEmail(),
  body("password", "password must be required").exists()
], async (req, res) => {
    //return function return error if there is a error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ error: "Please use the correct values" });
      }

      const comparePass = await bcrypt.compare(password, user.password);
      if (!comparePass) {
        return res.status(400).json({ error: "Please use the correct values" });
      }

      //creating json web token
      const data = {
        user: {
          id: user.id
        }
      }
      
      const jwtAuth = jwt.sign(data, secretKEy);
      res.json({ jwtAuth });

    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal Server Error");
    }
  });


// route3 get loggedin user detail using POST "/api/auth/getuser" login required
router.post('/getuser', getuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error");
  }
});


module.exports = router;