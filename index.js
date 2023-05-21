
const MongoDB = require("./db");
const express = require('express');
const cors = require('cors')

const app = express();
const port = 8000;

// using cors for browser and api connection codewithharry video 65
app.use(cors())
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

MongoDB();