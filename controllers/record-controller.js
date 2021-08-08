const Record = require("../models/sos_records");

exports.getRecord = (req, res, next) => {
  const recordId = req.params.recordId;
  Record.findById(recordId)
    .populate("patientId")
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    })
    .then((result) => {
      const userId = result.patientId._id;
      Record.find({ patientId: userId, discharged: true }).then((data) => {
        res.send({ ...result._doc, pastRecords: data });
      });
    });
};

exports.postDischarge = (req, res, next) => {
  const recordId = req.params.recordId;
  const cause = req.body.cause;
  Record.findById(recordId)
    .then((record) => {
      record.cause = cause;
      record.discharged = true;

      record.save().then((result) => {
        res.send({
          message: "Successfully Discharged",
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
