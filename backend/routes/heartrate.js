const express = require("express")
const ReferenceImg = require("../models/heartrate") // db model
const router = express.Router()
const {
    fetchAllHeartrateData,
    fetchHeartrateData,
    createHeartData,
    deleteHeartData,
    updateHeartData
} = require("../controllers/heartrate")




//get all refs
router.get('/', fetchAllHeartrateData)

//get a signle ref
router.get('/:id', fetchHeartrateData)

//POST a signle ref
router.post('/', createHeartData) 

//delete a ref
router.delete('/:id', deleteHeartData)

//update a ref
router.patch('/:id', updateHeartData)

module.exports = router