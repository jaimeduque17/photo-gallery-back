const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

// import routes
const albumRoutes = require("./routes/album");
const pictureRoutes = require("./routes/picture");

// app
const app = express();

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

// routes middleware
app.use("/api", albumRoutes);
app.use("/api", pictureRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`-- Server is running on port ${port} --`);
});