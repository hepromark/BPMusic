// utility functions for route api calls
const HeartRate = require("../models/heartrate") // db model
const mongoose = require('mongoose')
const start_song = require("./spotify")
require('dotenv').config()


const authorizeSpotify = async(req, res) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            "client_id": "d44b18cce0e744deb030c7ed8f4db49b",
            "redirect_uri": "http://localhost:3001/api/heartrate/callback/sun",
            "response_type": "code",
            "scope": "user-modify-playback-state user-read-private user-read-email"
        },
    };//https://accounts.spotify.com/authorize?client_id=d44b18cce0e744deb030c7ed8f4db49b&response_type=code&redirect_uri=http://localhost:3001/api/heartrate/callback/sun&scope=user-modify-playback-state%20user-read-private%20user-read-email
    const response = await fetch('https://accounts.spotify.com/authorize', requestOptions);
    const data = await response.json();
    console.log(data)
}

const gettoken = async(req, res) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa("d44b18cce0e744deb030c7ed8f4db49b:39f8b6fd14904b769f52540bbd577f56") // client_id and client_secret should be your app's credentials
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code, 
            redirect_uri: "http://localhost:3001/api/heartrate/callback/sun"
        })
    };
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', requestOptions);
        if (!response.ok) {
            // Handle errors
            console.error('Response Status:', response.status);
            const errorText = await response.text();
            console.error('Response Text:', errorText);
            return;
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
} 



const play_song = async(req, res) => {
    const heartdata = req.body
    if (heartdata) {const rate = heartdata["rate"]}

    const requestOptions = {
        method: 'PUT',
        headers: { 
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa("d44b18cce0e744deb030c7ed8f4db49b:39f8b6fd14904b769f52540bbd577f56") // client_id and client_secret should be your app's credentials
        },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code, 
            redirect_uri: "http://localhost:3001/api/heartrate/callback/sun"
        })
    };
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', requestOptions);
        if (!response.ok) {
            // Handle errors
            console.error('Response Status:', response.status);
            const errorText = await response.text();
            console.error('Response Text:', errorText);
            return;
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}


// get all workouts
const fetchAllHeartrateData = async(req, res) => {
    const heartdata = await HeartRate.find({}).sort({createdAt: -1})

    res.status(200).json(heartdata)
    //start_song(process.env.SPOTIFY_ACCESS,  process.env.SPOTIFY_URI)

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
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No such workout'})
    }
  
    const heartdata = await HeartRate.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if (!heartdata) {
      return res.status(400).json({error: 'No such workout'})
    }
  
    res.status(200).json(heartdata)
}

module.exports = {
    authorizeSpotify, 
    gettoken, 
    fetchAllHeartrateData,
    fetchHeartrateData,
    createHeartData,
    deleteHeartData,
    updateHeartData
}