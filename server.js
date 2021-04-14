const express = require('express')
const url = require('url')
const cookieParser = require('cookie-parser') // for reading cookies
const ac = require('./content/function/account.js')
const db = require('./databaseFunc.js')
const util = require('./serverUtil.js')
const app = express()

const PORT = 3100

app.use(express.static('content'));
app.use(express.json()); // we are sending json
app.use(cookieParser());

// initialize database
var mysql = require('mysql')
const e = require('express')
var con = mysql.createConnection({ // database connection
    // create connection to MySQL server
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'csci3100b8',
    database: 'gathable',
    multipleStatements: true
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/content/landing/landing.html');
});
app.get('/login/', function (req, res) {
    res.sendFile(__dirname + '/content/login/sign_in.html');
});
app.get('/register/', function (req, res) {
    res.sendFile(__dirname + '/content/register/register.html');
});
app.get('/home/', function (req, res) {
    res.sendFile(__dirname + '/content/home/home.html');
});
app.get('/profile/', function (req, res) {
    res.sendFile(__dirname + '/content/profile/profile.html');
});
app.get('/timetable/', function (req, res) {
    res.sendFile(__dirname + '/content/timetable/timetable.html');
});
app.get('/edit_timetable/', function (req, res) {
    res.sendFile(__dirname + '/content/edit_timetable/edit_timetable.html');
});
app.get('/add_event/', function (req, res) {
    res.sendFile(__dirname + '/content/add_event/add_event.html');
});
app.get('/create_group/', function (req, res) {
    res.sendFile(__dirname + '/content/create_group/create_group.html');
});
app.get('/groups/', function (req, res) {
    res.sendFile(__dirname + '/content/groups/groups.html');
});
// this page is for debug purpose only
app.get('/debug/', function (req, res) {
    res.sendFile(__dirname + '/content/debug/debug.html');
});

app.post('/register/', function (req, res) {

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

    con.query('SELECT uid FROM user_info WHERE uname = ?', [req.body.username], usernameExist)

    function usernameExist(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // if username alreadly exist...
            res.json({
                respondCode: 0,
                message: "sorry, username already exists"
            })
        }
        else con.query('SELECT uid FROM user_info WHERE email = ?', [req.body.email], emailExist)
    }
    function emailExist(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // if email alreadly exist...
            res.json({
                respondCode: 0,
                message: "sorry, Email already exists"
            })
        }
        else {
            randHash = util.randomHash()
            con.query('INSERT INTO user_info VALUES (?, ?, ?, ?, ?, ?, ?)',
                [null, req.body.username, req.body.pwHash, req.body.email, 0, randHash, 'nil'],
                (err, result, fields) => { if (err) throw err })
            util.newUserEmail(req.body.username, req.body.email, randHash)
            res.json({
                respondCode: 1,
                message: "reg ok",
            })
        }
    }
})

app.get('/verify/', function (req, res) { // process email verification link

    param = url.parse(req.url, true).query;
    con.query('SELECT uid FROM user_info WHERE uname = ? AND register_code = ? AND verified = 0',
        [param.uname, param.hash],
        verifcationValid)

    function verifcationValid(err, result, fields) {
        if (err) throw err
        if (result.length > 0) {
            con.query("UPDATE user_info SET verified = 1 WHERE uid = ?",
            [result[0].uid],
            (err, result, fields) => { if (err) throw err })
            res.sendFile(__dirname + '/content/verify/success.html');
        }
        else {
            res.sendFile(__dirname + '/content/verify/failure.html');
        }
    }
    
});

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
    con.query('SELECT a_password, verified FROM user_info WHERE uname = ?', [req.body.username], dbFunction)

    function dbFunction(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if username do not exist...
            res.json({
                respondCode: 0,
                message: "Error: this username is not registered yet"
            })
        }
        else if (result[0].a_password != req.body.pwHash) { // check password
            res.json({
                respondCode: 0,
                message: "Error: incorrect password"
            })
        }    
        else if (result[0].verified == 0) { // check verified or not
            res.json({
                respondCode: 0,
                message: "Error: account not verified. Please check your email for verification."
            })
        }
        else {
            res.json({
                respondCode: 1,
                message: "Okay!"
            })
        }
    }
})

app.post('/home/', function (req, res) { // both home and groups do the same thing, included in homeOrGroups()
    homeOrGroups(res, req)
})
app.post('/groups/', function (req, res) {
    homeOrGroups(res, req) 
})
function homeOrGroups(res, req) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)

    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if cookie is incorrect... (most likely a hacker)
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            con.query('SELECT gid FROM group_relation WHERE uname = ?', [req.cookies.username], getGroupId)
        }
    }
    var groupList = []
    var counter = 0
    function getGroupId(err, result, fields) {
        if (err) throw err
        if (result.length == 0)
            return
        for (var i = 0; i < result.length; i++) {
            groupList.push({
                gid: result[i].gid,
                gname: null,
                gmanager: null,
                gnotice: null,
                gcount: null
            })
        }
        con.query('SELECT gname, manager, gnotice FROM group_data WHERE id = ?', [groupList[counter].gid], getGroupData)
    }
    function getGroupData(err, result, fields) {
        if (err) throw err
        groupList[counter].gname = result[0].gname
        groupList[counter].gmanager = result[0].manager
        groupList[counter].gnotice = result[0].gnotice
        con.query('SELECT id FROM group_relation WHERE gid = ?', [groupList[counter].gid], getGroupCount)
    }
    function getGroupCount(err, result, fields) {
        if (err) throw err
        groupList[counter].gcount = result.length
        counter++
        if (counter >= groupList.length) {
            res.json({
                respondCode: 1,
                message: "so far so good",
                username: req.cookies.username,
                groupList: groupList
            })
        }
        else {
            con.query('SELECT gname, manager, gnotice FROM group_data WHERE id = ?', [groupList[counter].gid], getGroupData)
        }
    }
}

app.post('/profile/', function (req, res) {
    if (!db.verifyLogin(req.cookies.username, req.cookies.pwhash)) {
        res.json({
            respondCode: -1,
            message: "Cookies verification error."
        })
    }
    // else
    var email = db.getEmail(req.cookies.username)
    res.json({
        respondCode: 1,
        message: "so far so good",
        username: req.cookies.username,
        email: email
    })
})

app.post('/timetable/', function (req, res) {
    sendTimetable(req, res)
})
app.post('/edit_timetable/', function (req, res) {
    sendTimetable(req, res)
})
function sendTimetable(req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)

    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if cookie is incorrect... (most likely a hacker)
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            con.query('SELECT e_name, day, start_time, end_time FROM event_data WHERE uname = ?', [req.cookies.username], getEvents)
        }
    }
    function getEvents(err, result, fields) {
        if (err) throw err

        var eventList = []
        for (var i = 0; i < result.length; i++) {
            eventList.push({
                day: result[i].day,
                eventName: result[i].e_name,
                start: result[i].start_time,
                end: result[i].end_time
            })
        }
        res.json({
            respondCode: 1,
            message: "so far so good",
            events: eventList
        })
    }
}

app.post('/add_event/', function (req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)

    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if cookie is incorrect... (most likely a hacker)
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
            return
        }
        if (req.body.ename == '' || req.body.start == '' || req.body.end == '' || req.body.end <= req.body.start){
            res.json({
                respondCode: -1,
                message: "Data error."
            })
            return
        }
        con.query('INSERT INTO event_data VALUES (?, ?, ?, ?, ?, ?)',
            [null, req.cookies.username, req.body.ename, req.body.day, req.body.start, req.body.end],
            (err, result, fields) => {
                if (err) throw err
                res.json({
                    respondCode: 1,
                    message: "OK!"
                })
            })
    }
})

app.post('/create_group/', function (req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)

    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if cookie is incorrect... (most likely a hacker)
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            if (req.body.groupName.length > 20 || req.body.groupName.length == 0) {
                res.json({
                    respondCode: -1,
                    message: "Group name error. Hacker?"
                })
            }
            else if (req.body.description.length > 100) {
                res.json({
                    respondCode: -1,
                    message: "Group description error. Hacker?"
                })
            }
            else {
                con.query('INSERT INTO group_data VALUES (?, ?, ?, ?, ?)',
                    [null, req.cookies.username, req.body.groupName, req.body.description, null],
                hashGroup)
            }
        }
    }
    function hashGroup(err, result, fields) {
        if (err) throw err
        var groupId = result.insertId
        var groupHash = util.groupHash(groupId)
        con.query('UPDATE group_data SET ghash = ? WHERE id = ?',
            [groupHash, result.insertId], updateRelation)

        function updateRelation(err, result, fields) {
            if (err) throw err
            con.query('INSERT INTO group_relation VALUES (?, ?, ?)',
                [null, groupId, req.cookies.username],
                (err, result, fields) => {
                    if (err) throw err
                    res.json({
                        respondCode: 1,
                        message: "OK!"
                    })
                })
        }
    }
})

app.get('/join/', function (req, res) { // joinning a group

    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)

    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // bad cookies
            res.sendFile(__dirname + '/content/join/failure.html');
        }
        else {
            param = url.parse(req.url, true).query;
            con.query('SELECT id FROM group_data WHERE ghash = ?', [param.hash], checkHash)
        }
    }
    var groupId;
    function checkHash(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // if there's no such group...
            res.sendFile(__dirname + '/content/join/failure.html');
        }
        else {
            groupId = result[0].id
            con.query('SELECT uname FROM group_relation WHERE gid = ?', [groupId], checkJoin)
        }
    }
    function checkJoin(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // if already joined...
            res.sendFile(__dirname + '/content/join/failure.html');
        }
        else {
            con.query('INSERT INTO group_relation VALUES (?, ?, ?)',
                [null, groupId, req.cookies.username],
                (err, result, fields) => {
                    if (err) throw err
                    res.sendFile(__dirname + '/content/join/success.html');
                })
        }
    }
});

app.listen(PORT)