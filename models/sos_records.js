const mongoose = require('mongoose')
const { Schema } = mongoose

const recordSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    portalId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    discharged: {
        type: Boolean,
        default: false,
    },
    location: {
        lat: Number,
        long: Number
    },
    date: {
        type: String,
    },
    cause: {
        type: String,
    }
})

module.exports = mongoose.model('Records', recordSchema)