
const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/";

const MongoDB = () => {
    mongoose.connect(mongoURI);
    console.log('DB connected')
}

module.exports = MongoDB;