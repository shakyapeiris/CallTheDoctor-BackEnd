const User = require("../models/user");

const Admin = require("../models/admin");

const Record = require("../models/sos_records");

const distanceCalc = require("../utils/distance-calc");

exports.postRegister = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.send({ message: "Email repeated" });
    }
    var newUser = new User({
      name: req.body.name,
      age: req.body.age,
      gender: req.body.gender,
      address: req.body.address,
      diseases: req.body.diseases,
      email: req.body.email,
    });

    newUser.setPassword(req.body.password);

    newUser
      .save()
      .then((result) => {
        return res.status(201).send({
          message: "User added successfully.",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          message: "Failed to add user.",
        });
      });
  });
};

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1244992",
  key: "67a3346664a3e2867e68",
  secret: "ac04deb3254884b7eb12",
  cluster: "mt1",
  useTLS: true
});



exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).send({
          message: "User Logged In",
          userId: user._id
        });
      } else {
        return res.status(400).send({
          message: "Wrong Password",
        });
      }
    }
  });
};

exports.sendNotification = (req, res, next) => {
  const userCordinates = req.body.cordinates;
  let detail = {
    distance: 0,
    portalId: null,
  };
  Admin.find()
    .then((admins) => {
      admins.forEach((admin) => {
        const gap = distanceCalc(
          userCordinates.lat,
          userCordinates.long,
          admin.cordinates.lat,
          admin.cordinates.long
        );
        if ((detail.distance == 0 || gap < detail.distance) && admin.verified) {
          
          detail.distance = gap;
          detail.portalId = admin._id;
        }
        console.log(detail)
      });

      return detail
    })
    .catch((err) => {
      console.log(err);
    })
    .then((data) => {
      const newRecord = new Record({
        patientId: req.body.userId,
        portalId: data.portalId,
        date: new Date().toISOString().split("T")[0],
        cause: "",
        location: userCordinates
      });

      newRecord
        .save()
        .then((response) => {
          pusher.trigger("my-channel", "my-event", response);
          res.send({
            message: "Successfully Recorded",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
};

exports.getProfile = (req, res, next) => {
  const userId = req.params.userId
  User.findById(userId).then(user => {
    return{name: user.name, age: user.age, gender: user.gender, address: user.address, diseases: user.diseases}
  }).catch(err => {
    console.log(err)
  })
  .then(data => {
    Record.find({patientId: userId, discharged: true}).then(result => {
      res.send({...data, records: result})
    })
  })
}

