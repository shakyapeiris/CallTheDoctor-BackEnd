const Admin = require("../models/admin");

const Record = require("../models/sos_records")

const User = require("../models/user")

exports.postRegister = (req, res, next) => {
  Admin.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.send({ successful: false, message: "Email repeated" });
    }
    var newUser = new Admin({
      portalName: req.body.name,
      email: req.body.email,
      cordinates: req.body.cordinates,
      address: req.body.address,
      contactNo: req.body.contactNo,
    });

    newUser.setPassword(req.body.password);

    newUser
      .save()
      .then((result) => {
        return res.status(201).send({
          successful: true,
          message: "Admin added successfully.",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({
          successful: false,
          message: "Failed to add admin.",
        });
      });
  });
};

exports.postLogin = (req, res, next) => {
  
  Admin.findOne({ email: req.body.email }, function (err, user) {
    if (user === null) {
      return res.status(400).send({
        message: "User not found.",
      });
    } else {
      if (user.validPassword(req.body.password)) {
        return res.status(201).send({
          message: user.verified? "User Logged In" : "You must have a verified account to continue",
          verified: user.verified,
          userId: user.verified? user._id : null
        });
      } else {
        return res.status(400).send({
          message: "Wrong Password",
        });
      }
    }
  });
};

exports.getRecords = (req, res, next) => {
  const adminId = req.params.adminId;
  Admin.findById(adminId)
    .then(user => {
      Record
      .find({portalId: adminId, discharged: false})
      .then(result => {
        res.send({...result, userDetails: user})
      })
      .catch(err => {
        console.log(err)
      })
    }
  )
}