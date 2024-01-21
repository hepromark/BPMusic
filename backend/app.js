const http = require('http');
const express = require("express")
const mongoose = require("mongoose")
//const fetch = require('node-fetch')
require('dotenv').config()

const app = express()

const refRoutes = require("./routes/heartrate")


app.use(express.json()) // extra jso


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
    const code = "AQBDa_OBc6GUFkFohB4duGtAKF1_rkkW3nKg-yikc7bAoSgGkxCV4lG1hytgYC7SuBumKTAG6XlvMq-p_4SkxkEfIijIAZl6rt1aqxFM_ineHqnsrtbmZz6nzYyrbByUlmOp7hM-D_PoM-z9CjOubqO6bCzTx3XO7VNv_-eH_iNy5BQvkOuel7R42ipsgZCyaWAuTS2PaMTYdDqcpkQl_0Kckn2KAEVoxNFx87D6MGrntMubEbfho2h1meJ4mDalI00d04gbZuEgyxbiZKne_o85W0Q"
    if (code) {
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
    } else {
        res.status(400).send('No code provided. Cannot retrieve token.');
    }
});

app.put('/playback', async function(req, res) {
    const code = "BQCKMXezaopVc0b707N1cjUA_NNO5gGHjF2NwrdhMuJYxv3lEVNgT24arSdRiJ2Ozib_bbcLze0IegoF26CruqrTjc0P2EpiDUs7Li2tSnGbJ250G0RVd6eSySU1dmtzd89BZglrvReBnxCT6ynB_rbz3h-Ok-7xxSUpwV3ekW3kei1TIpv6AyZnBmk0oDXUQj9AqHtYpPweTwyG50SsG4o"
    

    heartdata = req.body
    if (heartdata){ rate = heartdata["rate"]}

    if (code) {
        try {
            const requestOptions = {
                method: 'PUT',
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${code}`
                },
                body: new URLSearchParams({
                    "context_uri": "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
                    "offset": {
                        "position": 5
                    },
                    "position_ms": 0
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
    } else {
        res.status(400).send('No code provided. Cannot retrieve token.');
    }
});

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Server is connected to the db and is listening on port 3000');
    });
    }).catch((error) => {
        console.log(error)
})

