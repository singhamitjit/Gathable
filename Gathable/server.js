const express = require('express')
const ac = require('./content/function/account.js')
const db = require('./databaseFunc.js')
const util = require('./serverUtil.js')
const app = express()
const PORT = 3100

app.use(express.static('content'));
app.use(express.json()); // we are sending json

// initialize database
db.init()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/content/landing/landing.html');
});
app.get('/login/', function (req, res) {
    res.sendFile(__dirname + '/content/login/sign_in.html');
});
app.get('/register/', function (req, res) {
    res.sendFile(__dirname + '/content/register/register.html');
});

app.post('/register/', function (req, res) {

    console.log(req.body) // for debugging
    // check validity of received data 
    if (
        ac.checkUserId(req.body.username) != ""         ||
        util.checkPasswordHash(req.body.pwHash) != ""   ||
        ac.checkEmail(req.body.email) != ""
    ){
        res.json({
            respondCode: -1,
            message: "Invalid data. Are you a hacker?"
        })
    }
    // if username alreadly exist...
    if (db.usernameExist(req.body.username)) {  // <-- database TODO
        res.json({
            respondCode: 0,
            message: "sorry, username already exists"
        })
    }
    // if username is not registered yet...
    else {
        randHash = util.randomHash()
        db.addNewUser(req.body.username, req.body.pwHash, req.body.email, randHash) // <-- database TODO
        util.newUserEmail(req.body.username, req.body.email, randHash)
        res.json({
            respondCode: 1,
            message: "reg ok",
        })
    }
})

app.post('/login/', function (req, res) {
    // check validity of received data 
    if (
        ac.checkUserId(req.body.username) != "" ||
        util.checkPasswordHash(req.body.pwHash) != ""
    ) {
        res.json({
            respondCode: -1,
            message: "Invalid data. Are you a hacker?"
        })
    }
    // if username do not exist...
    if (!db.usernameExist(req.body.username)) {  // <-- database TODO
        res.json({
            respondCode: 0,
            message: "this username is not registered yet"
        })
    }
    // check password
    else {
        if (db.verifyLogin(req.body.username, req.body.pwHash)){  // <-- database TODO
            res.json({
                respondCode: 1,
                message: "reg ok"
            })
        }
        else {
            res.json({
                respondCode: 2,
                message: "invalid password"
            })
        }
    }
})

app.listen(PORT)