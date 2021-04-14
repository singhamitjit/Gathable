/*html imports:
    - Ajax
    - jsSHA
    - "function/account.js"
*/
$('#register').click(() => {

    var userId = $('#username').val()
    var email = $('#email').val()
    var password = $('#password').val()
    var cpassword = $('#cpassword').val()

    // if there exists an empty field, ignore the click
    if (userId == "" || email == "" || password == "" || cpassword == "")
        return
    // if email invalid, also ignore it, because the UI will complain anyway
    if (checkEmail(email) != "")
        return
 
    msg = checkUserId(userId)
    if (msg != "") {
        alert(msg) // here I use alert for debugging only, it's ugly so we should change the display method later
        return
    }

    msg = checkPassword(password)
    if (msg != "") {
        alert(msg)
        return
    }

    if (password != cpassword) {
        alert("error: password and confirm password should be the same")
        return
    }

    // hash the password
    var hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 }); // numRounds: how many hash iterations, 1 is good enough for us
    hashObj.update(password);
    var hash = hashObj.getHash("HEX");

    // prepare the data to send to server
    var message = {
        username: userId,
        email: email,
        pwHash: hash
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/register',
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })
})

function onsuccess(data) {
    if (data.respondCode != 1) { // not successful because of invalid data or username registered already
        alert(data.message)
    }
    else {
        alert("Successful registration! Please check your email for account verification.")
        window.location.href = "/login/"
    }
}

function onerror() {
    alert('failed to connect to server...')
}