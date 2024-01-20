// utility functions for route api calls
const HeartRate = require("../models/heartrate") // db model
const mongoose = require('mongoose')


// get all workouts
const fetchAllHeartrateData = async(req, res) => {
    const heartdata = HeartRate.find({}).sort({createdAt: -1})

    res.status(200).json(heartdata)
}

// get a single workout
const fetchHeartrateData = async(req, res) => {
    /* Find a single reference via id */
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No such workout'})
    }
  
    const heartdata = await HeartRate.findById(id)
  
    if (!heartdata) {
      return res.status(404).json({error: 'No such workout'})
    }
  
    res.status(200).json(heartdata)
}

// POST a new workout
const createHeartData = async (req, res) => {
    const {rate} = req.body
    try {
        const heartdata = await HeartRate.create({rate}) // db model
        res.status(200).json(heartdata)
    }catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE a workout

const deleteHeartData = async(req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No reference found !"})
    }

    const heartdata = await HeartRate.findOneAndDelete({_id: id})

    if (!ref) {
        return res.status(404).json({error: "No reference found !"})
    }
    res.status(200)
}

// update a workout
const updateHeartData = async(req, res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No reference found !"})
    }

    const heartdata= await HeartRate.findOneAndUpdate({_id: id},
        {
            ...req.body  
        })

    if (!heartdata) {
        return res.status(404).json({error: "No reference found !"})
    }
    res.status(200)
}

module.exports = {
    fetchAllHeartrateData,
    fetchHeartrateData,
    createHeartData,
    deleteHeartData,
    updateHeartData
}