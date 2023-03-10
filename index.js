
const MongoDB = require("./db");

var express = require('express');
var app = express();
const port = 8000;
//this field is required when using json object
app.use(express.json());

app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes", require("./routes/notes"))

app.get("/", (req, res) => {
   res.send("Hello world");
})

app.listen(port, () => {
   console.log(`Listening on port localhost:${port}`);
});



console.log('System server is Running...');
MongoDB();