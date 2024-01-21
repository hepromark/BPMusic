const mongoose = require("mongoose")

const heartrate_schema = new mongoose.Schema( {
    rate: {
        type: Number,
        required: true
    },
    mode: {
        type:Number,
        required:true
    }
}, {timestamps:true})

module.exports = mongoose.model("heartrateSchema", heartrate_schema)
