// check whether the received hash string is really a hash value
function checkPasswordHash(hash) {
    var hashFormat = /[0-9a-f]{64}/
    if (!hash.match(hashFormat)) {
        return "ERROR: NOT A VALID SHA256 HASH"
    }
    else return "" // return empty string means success
}
// generate a random SHA256 hash for email or reset password
function randomHash() {
    var hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 })    // numRounds: how many hash iterations, 1 is good enough for us
    hashObj.update(Math.random().toString(16).substring(2))
    return hashObj.getHash("HEX")   // return hash value as a hexadecimal string
}

function newUserEmail(username, email, hash) {}     // TODO: send verification email to new user

module.exports = { checkPasswordHash, randomHash, newUserEmail }    // have to export like this