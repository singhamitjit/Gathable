function init() {}

// Accounts related
function usernameExist(username) {return true; return false}

function addNewUser(username, pwHash, email, randHash) {}

function verifyAccount(username, emailHash) { return true; return false }   // for new user

function verifyReset(username, emailHash) { return true; return false }     // for reset password

function verifyLogin(username, pwHash) { return true; return false}

function removeAccount(username) {}

module.exports = { init, usernameExist, addNewUser, verifyLogin }    // have to export like this

// To Be Continued...