const express = require('express');
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

//import the env files variables
require("dotenv").config();


// Create a User using POST "/api/auth/createuser" No login required
router.post('/createuser',
body("name","Please enter valid name").isLength({min:3}),
body("email","Please enter unique email").isEmail(),
body("password","password above 5 character").isLength({min:5})
,async(req, res) =>{

  const secretKEy = process.env.SECRET_KEY;
  
    //return function return error if there is a error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }



    //error handling with try catch
    try {
    //check wheather the email (email schema define unique) value exist already
    let user = await User.findOne({ email: req.body.email});
    if(user){
      return res.status(400).json({error: "Sorry a user with this email already exists"});
    }

    // hashing password for security reasons
    //creating a salt
    const salt = await bcrypt.genSalt(10);
    //creating a hash password
    const password = await bcrypt.hash(req.body.password, salt);


    //creating json web token
    const data = {
      user:{
        id: User.id
      }
    }
    const jwtAuth = jwt.sign(data,secretKEy);
    console.log(jwtAuth);



    //Create a new User
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: password
      })
      res.json(user)
    } catch (error) {
      
      console.error(error.message);
      res.status(500).send("some internal Error occurred");
    }

    });


module.exports = router;