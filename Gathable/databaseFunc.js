var mysql = require('mysql')
var con = null

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
    con.query('SELECT uname FROM event_data WHERE uname = ?',
        [username],
        function (err, result, fields) {
            if (err) throw err
            if (result.length > 0)
                return true
            else
                return false
    })
}

function addNewUser(username, pwHash, email, randHash) {
    con.query('INSERT INTO user_info VALUES (?, ?, ?, ?)',
        [username, pwHash, email, 0, randHash],
        function (err, result, fields) {
            if (err) throw err
            if (results.length > 0)
                console.log('add new user success')
            else
                console.log('add new user failed')
    })
}

function verifyAccount(username, emailHash) {
    con.query('SELECT register_code FROM user_info WHERE uname = ?',
        [username],
        function (err, result, fields) {
            if (err) throw err
            if (result.length && emailHash == result[0])
                return true
            else
                return false
    })
}   // for new user

function verifyReset(username, emailHash) {
    con.query('SELECT uname FROM user_info WHERE uname = ? AND register_code = ?',
        [username, emailHash],
        function (err, result, fields) {
            if (err) throw err
            if (result.length > 0)
                return true
            else
                return false
    })
}     // for reset password

function verifyLogin(username, pwHash) {
    con.query('SELECT uname FROM user_info WHERE uname = ? AND a_password = ?',
        [username, pwHash],
        function (err, result, fields) {
            if (err) throw err
            if (result.length > 0)
                return true
            else
                return false
    })
}

function removeAccount(username) {
    con.query('DELETE FROM user_info WHERE uname = ?',
        [username],
        function (err, result, fields) {
            if (err) throw err
            if (results.length > 0)
                console.log('delete user success')
            else
                console.log('delete user failed')
    })
}

module.exports = { init, usernameExist, addNewUser, verifyLogin }    // have to export like this

// To Be Continued...