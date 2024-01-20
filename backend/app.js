const http = require('http');
const express = require("express")
const mongoose = require("mongoose")
require('dotenv').config()

const app = express()

const refRoutes = require("./routes/heartrate")


app.use(express.json()) // extra json


app.use((req, res, next) => {
    console.log(req.path, res.method)
    next()
})

app.use('/heartrate', refRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is connected to the db and is listening on port 3000');
    });
    }).catch((error) => {
        console.log(error)
})

