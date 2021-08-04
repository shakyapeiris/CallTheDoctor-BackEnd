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
    }).then(result => {
        const userId = result.patientId._id;
        Record.find({patientId: userId, discharged: true}).then(data => {
            res.send({...result._doc, pastRecords: data})
        })
    });
};
