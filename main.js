const express = require('express')
const jwtDecode = require('jwt-decode');
const cors = require('cors')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const firebase = require('firebase');
const PORT = process.env.PORT || 3000


const fireApp = firebase.initializeApp({
    apiKey: "AIzaSyCdZ1VWw4PE7emxBuZ21I8wYIzQN2-zmOs",
    authDomain: "the-whitelist-app.firebaseapp.com",
    databaseURL: "https://the-whitelist-app.firebaseio.com",
    projectId: "the-whitelist-app",
    storageBucket: "the-whitelist-app.appspot.com",
    messagingSenderId: "1093479528138",
    appId: "1:1093479528138:web:354dc15deae77e2e1ca633",
    measurementId: "G-7JQ7CY6FLY"
});

let database = fireApp.database();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/api/savetoken', (req, res) => {
    let decoded = jwtDecode(req.query.token);
    let mcUsername = req.query.name;
    let twitchUsername = decoded.preferred_username;

    database.ref('users/' + twitchUsername).set({
        mcUsername: mcUsername,
        twitchUsername: twitchUsername
    });

    res.sendStatus(200);
});

app.get('/api/checkwatchtime/:username', async (req, res) => {

    let mcUsername = req.params.username;

    console.log(mcUsername);

    let twitchUsername = null;

    database.ref().child("users").orderByChild("mcUsername").equalTo(mcUsername).on('value', (snapshot) => {
        snapshot.forEach(data => {
            twitchUsername = data.key;
        });
    });

    console.log(twitchUsername);

    if (twitchUsername != null) {
        twitchUsername = twitchUsername.toLowerCase();
    }

    let response = await fetch('https://api.streamelements.com/kappa/v2/points/5c2c00ec8389306692b43527/watchtime?limit=2000');

    let json = await response.json();

    let minutes = 0;

    json.users.forEach(user => {
        if (user.username == twitchUsername) {
            console.log(user.minutes);
            minutes = user.minutes;
        }
    });

    let hours = Math.floor((minutes / 60));

    if (twitchUsername == null) {
        res.json({ allowed: false, reason: 'You have not registered this username (or try again in 10 seconds)' });
    } else if (hours == 0) {
        res.json({ allowed: false, reason: 'You have 0 hours of watch time for MisterGeof (or try again in 10 seconds)' });
    } else if (hours >= 50) {
        res.json({ allowed: true, hours: hours });
    } else {
        res.json({ allowed: false, reason: 'You only have ' + hours + ' hrs of watch time for MisterGeof. If you previously could connect this was due to a bug.' });
    }
});

app.get('/oauth/redirect', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/connected.html'));
})

app.use(express.static(__dirname + '/public'))
app.listen(PORT, () => {
    console.log("Webserver Running")
})
