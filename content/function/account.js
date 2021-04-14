// regular expression reference: https://www.w3resource.com/javascript/form/password-validation.php

function checkUserId(userId) {
    var userIdFormat = /^[A-Za-z]\w{3,20}$/ // regular expression, see the above link for details
    if (!userId.match(userIdFormat)) {
        return "Username should satisfy the following requirements:\
        \n - between 3 to 20 characters\
        \n - only contains letters, numeric digits and underscores\
        \n - starts with a letter"
    }
    else return ""
}

function checkPassword(password) {
    var passwordFormat = /[a-zA-Z0-9!@#$%^&*_]{6,20}$/
    if (!password.match(passwordFormat)) {
        return "password should satisfy the following requirements:\
        \n - between 6 to 20 characters\
        \n - only contains letters, numeric digits, underscores and the following special characters: ! @ # $ % ^ & *\
        \n - starts with a letter"
    }
    else return ""
}

// email regular expression reference: https://www.w3resource.com/javascript/form/email-validation.php
function checkEmail(email) {
    var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (!email.match(emailFormat)) {
        return "YOUR EMAIL IS NOT VALID !!! (won't show to user)"
    }
    else return ""
}

// if bad cookies detected
function badCookies() {
    // clear cookies
    document.cookie = "username=" + userId + "; expires=Sat, 01 Jan 1970 00:00:00 UTC; path=/"
    document.cookie = "pwhash=" + hash + "; expires=Sat, 01 Jan 1970 00:00:00 UTC; path=/"
    // redirect back to login
    window.location.href = "/login/"
    return
}

module.exports = { checkUserId, checkPassword, checkEmail }    // have to export to nodeJS like this