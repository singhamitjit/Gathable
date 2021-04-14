let mysql = require('mysql')
let con = null

function init() {
    con = mysql.reateConnection({
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: '123',
        database: 'documentario',
        multipleStatements: true
    });
}

// Accounts related
function usernameExist(username) {
    return new Promise(function (resolve, reject) {
        con.query('SELECT uname FROM event_data WHERE uname = ?',
            username,
            function (err, result, fields) {
                if (err) reject(err)
                if (result.length > 0)
                    return resolve(true)
                else
                    return resolve(false)
            })
    })
}

function addNewUser(username, pwHash, email, randHash) {
    return new Promise(function (resolve, reject) {
        con.query('INSERT INTO user_info VALUES (?, ?, ?, ?)',
            [username, pwHash, email, 0, randHash],
            function (err, result, fields) {
                if (err) reject(err)
                if (results.length > 0)
                    console.log('add new user success')
                else
                    console.log('add new user failed')
                resolve(result)
            })
    })
}

function verifyAccount(username, emailHash) {
    return new Promise(function (resolve, reject) {
        con.query('SELECT register_code FROM user_info WHERE uname = ?',
            username,
            function (err, result, fields) {
                if (err) reject(err)
                if (result.length && emailHash == result[0][0])
                    return resolve(true)
                else
                    return resolve(false)
            })
    })
}   // for new user

function verifyReset(username, emailHash) {
    return new Promise(function (resolve, reject) {
        con.query('SELECT uname FROM user_info WHERE uname = ? AND register_code = ?',
            [username, emailHash],
            function (err, result, fields) {
                if (err) reject(err)
                if (result.length > 0)
                    return resolve(true)
                else
                    return resolve(false)
            })
    })
}     // for reset password

function verifyLogin(username, pwHash) {
    return new Promise(function (resolve, reject) {
        con.query('SELECT uname FROM user_info WHERE uname = ? AND a_password = ?',
            [username, pwHash],
            function (err, result, fields) {
                if (err) reject(err)
                if (result.length > 0)
                    return resolve(true)
                else
                    return resolve(false)
            })
    })
}

function removeAccount(username) {
    return new Promise(function (resolve, reject) {
        con.query('DELETE FROM user_info WHERE uname = ?',
            username,
            function (err, result, fields) {
                if (err) reject(err)
                if (results.length > 0)
                    console.log('delete user success')
                else
                    console.log('delete user failed')
                resolve(result)
            })
    })
}
//
function GetSharedTimetable(groupID) {
    return new Promise(function (resolve, reject) {
        con.query("SELECT * FROM event_data e JOIN group_data g ON e.group_id = g.group_id WHERE group_id = ?",
            groupID,
            function (err, result, fields) {
                if (err) reject(err)
                console.log(result)
                resolve(result)
            })
    })
}
function GetTimetableUnion(groupID) {
    // read all users in group
    // search users timetable by userID(repeat for all users)
    // union all users' time table
}
function GetAllEventsInGroup(groupID) {
    return new Promise(function (resolve, reject) {
        let sql = "SELECT eid, uid, start_time, end_time, e_name, loc, spec "
            + "FROM event_data e "
            + "JOIN group_relation r ON e.uid = r.uid "
            + "WHERE gid = ?"
        con.query(sql, groupID,
            function (err, result, fields) {
                if (err) reject(err)
                console.log(result)
                resolve(result)
            })
    })
}
function SendTimeTableToGroup() {
}
function CreateGroup(groupManager, groupName, groupNotice) {
    return new Promise(function (resolve, reject) {
        con.query("INSERT INTO group_data (manager, gname, gnotice) VALUES (? , ?, ?)",
            [groupManager, groupName, groupNotice],
            function (err, result) {
                if (err) reject(err)
                if (result.length > 0)
                    console.log("group created")
                else
                    console.log("failed to create group")
                resolve(result)
            })
        })
}
function AddUserIdToGroup(userID, groupID) {
    return new Promise(function (resolve, reject) {
        con.query("INSERT INTO group_relation (gid, uid) VALUES (" + groupID + ", " + userID + ")",
            function (err, result) {
                if (err) reject(err)
                if (result.length > 0)
                    console.log("added 1 user to group")
                else
                    console.log("failed to add the user to group")
                resolve(result)
            })
        })
}
function DeleteGroup(groupID) {
    return new Promise(function (resolve, reject) {
        con.query("DELETE FROM group_data WHERE gid = ?",
            groupID,
            function (err, result) {
                if (err) reject(err)
                if (result.length > 0)
                    console.log("deleted the group")
                else
                    console.log("failed to delete the group")
                resolve(result)
            })
        })
}
function EditGroupInfo(groupID, groupManager, groupName, groupNotice) {
    return new Promise(function (resolve, reject) {
        con.query("UPDATE group_data SET manager = ?, gname = ?, gnotice = ? WHERE gid = ?",
            [groupManager, groupName, groupNotice, groupID],
            function (err, result) {
                if (err) reject(err)
                if (result.length > 0)
                    console.log("edit group success")
                else
                    console.log("edit group failed")
                resolve(result)
            })
    })
}



module.exports = { init, usernameExist, addNewUser, verifyAccount, verifyReset, verifyLogin,
    removeAccount, GetSharedTimetable, GetTimetableUnion, GetAllEventsInGroup, CreateGroup,
    AddUserIdToGroup, DeleteGroup, EditGroupInfo }    // have to export like this

// To Be Continued...