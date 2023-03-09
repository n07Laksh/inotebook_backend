
const MongoDB = require("./db");

var express = require('express');
var app = express();



app.get('/', function(req, res){
   res.send("Hello Laksh!");
});

app.listen(8000);



console.log('System server is Running...');
MongoDB();