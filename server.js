const express = require("express");
const app = express();

const mongoose = require("mongoose");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

//Routes
const clientRoutes = require("./routes/client-routes");
app.use("/user", clientRoutes);

const adminRoutes = require("./routes/admin-routes");
app.use("/admin", adminRoutes);

const recordRoutes = require("./routes/record-routes");
app.use("/records", recordRoutes);

mongoose
  .connect(
    "mongodb+srv://Shakya:gq4aWAhOTPsCFdlJ@cluster0.grdn2.mongodb.net/sosDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((result) => {
    console.log("Database Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

  // const accountSid = "ACb300c85a1d8325da8f4238d8cda8e851";
  // const authToken = "5e181e659ab954ec69258a148a5a295b";
  // const client = require("twilio")(accountSid, authToken);
  // client.messages
  //   .create({
  //     body: "This is the ship that made the Kessel Run in fourteen parsecs?",
  //     from: "+19723664621",
  //     to: "+94714452248",
  //   })
  //   .then((message) => console.log(message.sid));
app.listen(process.env.PORT || 5000, () => {
  console.log("App connected to port 5000")
});
