const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.get('/oauth/redirect', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/connected.html'));
})

app.use(express.static(__dirname + '/public'))
app.listen(PORT, () => {
    console.log("Webserver Running")
})
