const express = require('express')

const app = express()

app.get('/oauth/redirect', (req, res) => {
    
    let query = req.query;
    console.log(query);

    res.sendFile(__dirname + '/public/connected.html');
})

app.use(express.static(__dirname + '/public'))
app.listen(80)
console.log("Webserver Running")