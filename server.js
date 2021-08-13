const express = require("express");
const app = express();

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

require('dotenv').config();

//Routes
const clientRoutes = require("./routes/client-routes");
app.use("/user", clientRoutes);

const adminRoutes = require("./routes/admin-routes");
app.use("/admin", adminRoutes);

const recordRoutes = require("./routes/record-routes");
app.use("/records", recordRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@cluster0.grdn2.mongodb.net/sosDB?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT || 5000, () => {
  console.log("App connected to port 5000")
});
