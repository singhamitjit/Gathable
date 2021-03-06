const express = require('express')
const url = require('url')
const cookieParser = require('cookie-parser')       // for reading cookies
const ac = require('./content/function/account.js') // functions for checking format correctness of username and email
const util = require('./serverUtil.js')             // server utility functions for performing hash operations and sending emails
const app = express()

const PORT = 3100

app.use(express.static('content'));
app.use(express.json()); // we are sending json
app.use(cookieParser());

// initialize database
var mysql = require('mysql')
const e = require('express')
const { get } = require('http')
var con = mysql.createConnection({ // database connection
    // create connection to MySQL server
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'csci3100b8',
    database: 'gathable',
    multipleStatements: false // disabled to prevent SQL Injection Attacks
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
app.get('/forgot/', function (req, res) {
    res.sendFile(__dirname + '/content/forgot/forgot.html');
});
app.get('/home/', function (req, res) {
    res.sendFile(__dirname + '/content/home/home.html');
});
app.get('/profile/', function (req, res) {
    res.sendFile(__dirname + '/content/profile/profile.html');
});
app.get('/change_pw/', function (req, res) {
    res.sendFile(__dirname + '/content/change_pw/change_pw.html');
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
app.get('/group_tb/', function (req, res) {
    res.sendFile(__dirname + '/content/group_tb/group_tb.html');
});
app.get('/leave/', function (req, res) {
    res.sendFile(__dirname + '/content/leave/leave.html');
})
// this page is for debug purpose only
// app.get('/debug/', function (req, res) {
//     res.sendFile(__dirname + '/content/debug/debug.html');
// });

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
    
    param = url.parse(req.url, true).query; // parse the url parameters containing username and verification hash
    con.query('SELECT uid FROM user_info WHERE uname = ? AND register_code = ? AND verified = 0',
        [param.uname, param.hash],
        verifcationValid)

    function verifcationValid(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // verification data is correct
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

app.post('/forgot/', function (req, res) {
    if (ac.checkEmail(req.body.email) != "") {
        res.json({
            respondCode: -1,
            message: "Invalid data. Are you a hacker?"
        })
    }
    else {
        con.query('SELECT uname FROM user_info WHERE email = ?', [req.body.email], checkEmail)
    }
    function checkEmail(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // no such email
            res.json({
                respondCode: 1, // let's just fake the user that we have sent the email
                message: "OK"
            })
        }
        else {
            var username = result[0].uname
            randHash = util.randomHash()
            con.query('UPDATE user_info SET reset_code = ? WHERE uname = ?',
                [randHash, username], (err, result, fields) => {
                    if (err) throw err
                    util.ResetPasswordEmail(username, req.body.email, randHash) // in this case we really send an email
                    res.json({
                        respondCode: 1, 
                        message: "OK"
                    })
                })
        }
    }
})

app.get('/reset/', function (req, res) { // process email verification link

    param = url.parse(req.url, true).query;
    if (param.hash.length != 64) {
        res.sendFile(__dirname + '/content/reset/failure.html');
    }
    con.query('SELECT uid FROM user_info WHERE uname = ? AND reset_code = ?',
        [param.uname, param.hash],
        checkHash)

    function checkHash(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // incorrect password reset link
            res.sendFile(__dirname + '/content/reset/failure.html');
        }
        else {
            res.sendFile(__dirname + '/content/reset/reset.html');
        }
    }

});
app.post('/reset/', function (req, res) {

    param = url.parse(req.body.urlp, true).query; // parse the url parameters containing username and password reset hash

    if (param.hash.length != 64) {
        res.json({
            respondCode: -1,
            message: "Invalid data. Are you a hacker?"
        })
    }
    con.query('SELECT uid FROM user_info WHERE uname = ? AND reset_code = ?',
        [param.uname, param.hash],
        checkUrlParameter)

    function checkUrlParameter(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // invalid password reset hash
            res.json({
                respondCode: -1,
                message: "Invalid data. Are you a hacker?"
            })
        }
        else {
            if (util.checkPasswordHash(req.body.pwHash) != "") { // invalid password hash format
                res.json({
                    respondCode: -1,
                    message: "Invalid data. Are you a hacker?"
                })
            }
            else {
                con.query('UPDATE user_info SET a_password = ?, reset_code = "nil" WHERE uname = ?',
                    [req.body.pwHash, param.uname],
                    (err, result, fields) => {
                        if (err) throw err
                        res.json({
                            respondCode: 1,
                            message: "OK"
                        })
                    })
            }
        }
    }
})

app.post('/home/', function (req, res) {    // both home and groups do the same thing, included in homeOrGroups()
    homeOrGroups(res, req)
})
app.post('/groups/', function (req, res) {  // both home and groups do the same thing, included in homeOrGroups()
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
    var groupList = [] // retrieve user's group list
    var counter = 0
    function getGroupId(err, result, fields) {
        if (err) throw err
        if (result.length == 0){
            res.json({
                respondCode: 1,
                message: "so far so good",
                username: req.cookies.username,
                groupList: groupList
            })
            return
        }
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
    function getGroupData(err, result, fields) { // callback function cycle getGroupData <--> getGroupCount to fill the group list
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

app.post('/group_tb/', function (req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)
    var groupId = -1
    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // bad cookies
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            groupId = url.parse(req.url, true).query.gid
            con.query('SELECT id FROM group_relation WHERE uname = ? AND gid = ?', [req.cookies.username, groupId], checkMember)
        }
    }
    function checkMember(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // haven't joined the group, hacker
            res.json({
                respondCode: -1,
                message: "Error: you haven't joined this group yet"
            })
        }
        else {
            con.query('SELECT gname, ghash FROM group_data WHERE id = ?', [groupId], getGroupHash)
        }
    }
    var members = []
    var counter = 0
    var eventList = []
    var groupName;
    var groupHash;
    function getGroupHash(err, result, fields) {
        if (err) throw err
        groupName = result[0].gname
        groupHash = result[0].ghash
        con.query('SELECT uname FROM group_relation WHERE gid = ?', [groupId], getUname)
    }
    function getUname(err, result, fields) {
        if (err) throw err
        members = result
        nextMember()
    }
    function nextMember() { // callback function cycle nextMember <--> getEvents to fill the group event list
        if (counter >= members.length) {
            res.json({
                respondCode: 1,
                message: "OK!",
                groupName: groupName,
                groupHash: groupHash,
                eventList: eventList
            })
        }
        else {
            con.query('SELECT day, start_time, end_time FROM event_data WHERE uname = ?', [members[counter].uname], getEvents)
        }
    }
    function getEvents(err, result, fields){
        if (err) throw err
        for (var i = 0; i < result.length; i++) {
            eventList.push({
                day: result[i].day,
                start: result[i].start_time,
                end: result[i].end_time
            })
        }
        counter++
        nextMember()
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
                con.query('INSERT INTO group_data VALUES (?, ?, ?, ?, ?)', // add the new group to the database
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
            con.query('INSERT INTO group_relation VALUES (?, ?, ?)', // add group relation of the creator to the group
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

app.get('/join/', function (req, res) { // joining a group

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
            con.query('SELECT uname FROM group_relation WHERE gid = ? AND uname = ?', [groupId, req.cookies.username], checkJoin)
        }
    }
    function checkJoin(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // if already joined...
            res.sendFile(__dirname + '/content/join/failure.html');
        }
        else {
            con.query('INSERT INTO group_relation VALUES (?, ?, ?)', // add the user to the group
                [null, groupId, req.cookies.username],
                (err, result, fields) => {
                    if (err) throw err
                    res.sendFile(__dirname + '/content/join/success.html');
                })
        }
    }
});

app.post('/leave/', function (req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)
    var groupId = -1
    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // bad cookies
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            groupId = url.parse(req.url, true).query.gid
            con.query('SELECT id FROM group_data WHERE id = ? AND manager = ?', [groupId, req.cookies.username], checkManager)
        }
    }
    function checkManager(err, result, fields) {
        if (err) throw err
        if (result.length > 0) { // the one leaving is the creator!
            removeGroup()
        }
        else {
            leaveGroup()
        }
    }
    function removeGroup() {
        con.query('DELETE FROM group_relation WHERE gid = ?', [groupId], (err, result, fields) => {
            if (err) throw err
            con.query('DELETE FROM group_data WHERE id = ?', [groupId], (err, result, fields) => {
                if (err) throw err
                res.json({
                    respondCode: 1,
                    message: "OK"
                })
            })
        })
    }
    function leaveGroup() {
        con.query('DELETE FROM group_relation WHERE gid = ? AND uname = ?', [groupId, req.cookies.username], (err, result, fields) => {
            if (err) throw err
            res.json({
                respondCode: 1,
                message: "OK"
            })
        })
    }
})

app.post('/profile/', function (req, res) {
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)
    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // bad cookies
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            con.query('SELECT uid, uname, email FROM user_info WHERE uname = ?', [req.cookies.username], sendInfo)
        }
    }
    function sendInfo(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // no such username
            res.json({
                respondCode: -1,
                message: "You do not exist!?"
            })
        } else {
            res.json({
                respondCode: 1,
                message: "OK",
                uid: result[0].uid,
                uname: result[0].uname,
                uemail: result[0].email
            })
        }
    }
})

app.post('/change_pw/', function (req, res) {
    // check validity of received data 
    if (util.checkPasswordHash(req.body.ohash) != "" || util.checkPasswordHash(req.body.nhash) != "" ) {
        res.json({
            respondCode: -1,
            message: "Invalid data. Are you a hacker?"
        })
        return
    }
    con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ? AND verified = 1',
        [req.cookies.username, req.cookies.pwhash], checkCookie)
    function checkCookie(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // bad cookies
            res.json({
                respondCode: -1,
                message: "Cookies verification error."
            })
        }
        else {
            con.query('SELECT uid FROM user_info WHERE uname = ? AND a_password = ?', [req.cookies.username, req.body.ohash], checkOldPassword)
        }
    }
    function checkOldPassword(err, result, fields) {
        if (err) throw err
        if (result.length == 0) { // wrong old password
            res.json({
                respondCode: 0,
                message: "Wrong old pw"
            })
        }
        else {
            con.query('UPDATE user_info SET a_password = ? WHERE uname = ?', // update the new password
                [req.body.nhash, req.cookies.username],
                (err, result, fields) => {
                    if (err) throw err
                    res.json({
                        respondCode: 1,
                        message: "OK"
                    })
            })
        }
    }
})

app.post('/timetable/', function (req, res) {       // both timetable and edit_timetable retrieves the same data, implemented in sendTimetable()
    sendTimetable(req, res)
})
app.post('/edit_timetable/', function (req, res) {  // both timetable and edit_timetable retrieves the same data, implemented in sendTimetable()
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
            con.query('SELECT id, e_name, day, start_time, end_time FROM event_data WHERE uname = ?', [req.cookies.username], getEvents)
        }
    }
    function getEvents(err, result, fields) {
        if (err) throw err

        var eventList = [] // the list of events of the user
        for (var i = 0; i < result.length; i++) {
            eventList.push({
                id: result[i].id,
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

app.delete('/edit_timetable/', function (req, res) { // a delete request to delete an event
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
            con.query('DELETE FROM event_data WHERE id = ?', [req.body.id], (err, result, fields) => {
                if (err) throw err
                res.json({
                    respondCode: 1,
                    message: "OK"
                })
            })
        }
    }
})

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


app.listen(PORT)