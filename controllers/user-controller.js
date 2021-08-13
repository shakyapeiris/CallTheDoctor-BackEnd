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
      contactNo: req.body.contactNo,
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
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
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
  const patient =  req.body.userId;
  console.log(patient)
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
        if ((detail.portalId == null || gap < detail.distance) && admin.verified) {
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
        patientId: patient,
        portalId: data.portalId,
        date: new Date().toISOString().split("T")[0],
        cause: "",
        location: userCordinates
      });


      

      newRecord
        .save()
        .then((response) => {
          pusher.trigger("my-channel", response.portalId, response);
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
    return{name: user.name, age: user.age, gender: user.gender, address: user.address, diseases: user.diseases, contactNo: user.contactNo}
  }).catch(err => {
    console.log(err)
  })
  .then(data => {
    Record.find({patientId: userId, discharged: true}).then(result => {
      console.log({...data, records: result})
      res.send({...data, records: result})
    })
  })
}

exports.verifiyUser = (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId).then(user => {
    if (user) return res.send({validated: true})
    res.send({validated: false})
  }).catch(err => {
    res.send({validated: false})
  })
}