const express = require('express')
const app = express()
const PORT = 3100

app.use(express.static('content')) // send everything under 'content' directory for homepage request 
app.use(express.json()); // we are sending json

app.post('/', (req, res) => {

    console.log('Post detected.')
    console.log(req.body)

    req.body.ele.name = 'this string is modified by the server!' // modify the posted json

    res.json(req.body) // send the json back to client

})



app.get('/verify/:hash', async(req,res) => {
	const { hash } = req.params
}



app.listen(PORT)