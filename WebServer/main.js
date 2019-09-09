const express = require('express')

const app = express()

app.get('/oauth/redirect', (req, res) => {
    res.sendFile(__dirname + '/public/connected.html');
})

app.use(express.static(__dirname + '/public'))
app.listen(8000, () => {
    console.log("Webserver Running")
})
