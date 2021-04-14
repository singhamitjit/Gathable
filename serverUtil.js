const jsSHA = require("jssha");
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gathable@gmail.com',
        pass: 'asdfg1234qwerty'
    }
});

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

function groupHash(groupId) {
    var hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 })    // numRounds: how many hash iterations, 1 is good enough for us
    hashObj.update(groupId.toString())
    return hashObj.getHash("HEX")   // return hash value as a hexadecimal string
}

function newUserEmail(username, email, hash) {
    var mailOptions = {
        from: 'gathable@gmail.com',
        to: email,
        subject: 'Gathable E-mail Verification',
        html: '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.0/font/bootstrap-icons.css">\
        <h1>Welcome to <a class="navbar-brand"><i class="bi bi-calendar-range"></i> Gathable</a></h1>\
        <h3>E-verification</h3><p>Click <a href=http://localhost:3100/verify/?uname=' + username + '&hash=' + hash + '> here</a> to verify your e-mail registered with us!</p>\
        <p>We hope you enjoy your experience with us!</p><p>Thanks.</p>'
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log(error)
        else
            console.log('Email sent');
    });
}

module.exports = { checkPasswordHash, randomHash, groupHash, newUserEmail }    // have to export like this