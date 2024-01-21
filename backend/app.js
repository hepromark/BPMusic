const http = require('http');
const express = require("express")
const mongoose = require("mongoose")
const song_list = require("./songs")
//const fetch = require('node-fetch')
require('dotenv').config()

const app = express()

const refRoutes = require("./routes/heartrate");
const { stringify } = require('querystring');
const { resourceLimits } = require('worker_threads');
const HeartRate = require('./models/heartrate');
const heartrate = require('./models/heartrate');
//const HeartRate = require('./')
const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:8080', // or the specific port your frontend runs on
};

app.use(cors(corsOptions));

app.use(express.json()) // extra jso
cors

app.use((req, res, next) => {
    console.log(req.path, res.method)
    next()
})

app.use('/api/heartrate', refRoutes)

const client_id = 'd44b18cce0e744deb030c7ed8f4db49b'; // Your Spotify client ID
const redirect_uri = 'http://localhost:3001/api/heartrate/callback/sun'; // Your redirect URI
const scope = 'user-modify-playback-state user-read-private user-read-email'; // Scopes

// Route to start the authorization process and redirect user to Spotify's authorization page
app.get('/login', function(req, res) {
    const queryParams = new URLSearchParams({
        client_id: client_id,
        redirect_uri: redirect_uri,
        response_type: 'code',
        scope: scope
    });

    res.redirect('https://accounts.spotify.com/authorize?' + queryParams.toString());
});

app.get('/callback', async function(req, res) {
    const code = "AQCUjCXbEcd8IDmCCHgAfT1ZIr807iVb2DZQWDI-R-zMH-pY0bbpkLg3TU7MObKYjpkpPjGcxKx5zk-eYtQo6k1YeeELpHoO4xV8C-TPelazoo0gmfO0UyGLqp-2WiYYFx4gUYuG8t9PCsrVt9fy8CMvwAs2-w-MN5BmiKeGR4TP84HV11HqkTX8_GPZnH_xpkmtq7NqLGTpCVLo9yVrmaM5UPKiMcCo7w3Yi3yc7npbijTIrWZZE8U5d8W8yT-zX0jqGH79mbwwVHqroljWOrOh6sk"
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    "Content-Type": "application/x-www-form-urlencoded",
                    // Replace btoa with Buffer.from().toString('base64') for Node.js environment
                    "Authorization": "Basic " + Buffer.from("d44b18cce0e744deb030c7ed8f4db49b:39f8b6fd14904b769f52540bbd577f56").toString('base64')
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code: code,
                    redirect_uri: "http://localhost:3001/api/heartrate/callback/sun"
                })
            };

            const response = await fetch('https://accounts.spotify.com/api/token', requestOptions);
            const data = await response.json();

            if (response.ok) {
                // Access token retrieved successfully
                console.log('Access Token:', data.access_token);
                res.json(data); // Send the data back to the client
            } else {
                // Handle errors
                console.error('Token retrieval error:', data);
                res.status(400).json(data);
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('An error occurred.');
        }

});

app.put('/playback', async function(req, res) {
    const  id  = '65ac5ea8e1a9bc3f088d1350'
    const heartdata = await HeartRate.findById(id)
  
    if (!heartdata) {
      return res.status(404).json({error: 'No such '})
    }
    await HeartRate.findOneAndUpdate({_id: id}, {
        ...req.body
      })
    var heartrate = heartdata["rate"]
    if (req.body["mode"] == 1){ heartrate= heartrate - 20 < 60 ? 60 : Math.round((heartrate - 20)/10) * 10
}
    else if (req.body["mode"] > 1){
        console.log("burhg")
        heartrate = heartrate + 20 > 140 ? 140 : Math.round((heartrate + 20)/10) * 10
    }else if (req.body["mode"] == 0 ){
        if (heartrate < 60) {heartrate = 60}
        else if (heartrate > 130) {heartrate = 130}
        else {
            heartrate = Math.round((heartrate )/10) * 10
        }
    }
    heartrate_str = heartrate.toString()

    const code = "BQCwdlacrvUzKQLXKwn06ZtQXcnx-_ejKL0mqvZwesZFc_AF3tP42SzIWMIKEfArgwY69nVEPea4r4sR7VhOepe_T_kj3JZvx3-8ghJQIt0GA3d0jdT6-HvXV_IeM_yBMhI7VobCmdjvxEanhO-8ypuA5vKBOtGS4dKaH7P9R7RLbJFt2UzTuaNKF9Egp8M1Wlt0GAhd3Xq0HFmzd_Czx9o"

     rate = "90"//(Math.ceil(heartdata["rate"]/ 10) * 10).toString()
     console.log(heartrate_str)
     console.log(song_list[heartrate_str][0])


    console.log(heartrate_str)
    if (code) {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${code}`
                },
                body: JSON.stringify({
                    "context_uri": song_list[heartrate_str][0],
                    "offset": {
                        "position": 5
                    },
                    "position_ms": 0
                })
            };
            console.log('kadkfdisdf')

            const response = await fetch('https://api.spotify.com/v1/me/player/play', requestOptions);
            //const data = await response.json();
            //console.log(data)

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('An error occurred.');
        }
    } else {
        res.status(400).send('No code provided. Cannot retrieve token.');
    }
    res.status(200).json({"wow": "epic"})
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is connected to the db and is listening on port 3000');
    });
    }).catch((error) => {
        console.log(error)
})
