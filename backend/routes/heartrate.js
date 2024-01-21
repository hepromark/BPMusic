const express = require("express")
const ReferenceImg = require("../models/heartrate") // db model
const router = express.Router()
const {
    authorizeSpotify,
    gettoken,
    fetchAllHeartrateData,
    fetchHeartrateData,
    createHeartData,
    deleteHeartData,
    updateHeartData
} = require("../controllers/heartrate")


router.get('/callback', authorizeSpotify)

router.post('/ballback', gettoken)

//get all refs
router.get('/', fetchAllHeartrateData)

//get a signle ref
router.get('/:id', fetchHeartrateData)

//POST a signle ref
router.post('/:id', updateHeartData) 

//delete a ref
router.delete('/:id', deleteHeartData)

//update a ref
router.patch('/:id', updateHeartData)

module.exports = router