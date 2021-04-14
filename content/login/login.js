/*html imports:
    - Ajax
    - jsSHA
    - "function/account.js"
*/
$('#signIn').click(() => {

    var userId = $('#userId').val()
    var password = $('#password').val()

    // if there exists an empty field, ignore the click
    if (userId == "" || password == "")
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

    // hash the password
    var hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 }); // numRounds: how many hash iterations, 1 is okay
    hashObj.update(password);
    var hash = hashObj.getHash("HEX");
    
    var message = {
        username: userId,
        pwHash: hash
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/login',
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })

    function onsuccess(data) {
        if (data.respondCode != 1) { // not successful
            alert(data.message)
        }
        else {
            alert("Successful login!")
            // add cookie storing username and password hash (hardcode the expire date as 2022/01/01 for now),
            // set path to root so every page can access
            document.cookie = "username=" + userId + "; expires=Sat, 01 Jan 2022 00:00:00 GMT; path=/"
            document.cookie = "pwhash=" + hash + "; expires=Sat, 01 Jan 2022 00:00:00 GMT; path=/"
            // redirect to the main page
            window.location.href = "/home/"
        }
    }

    function onerror() {
        alert('failed to connect to server...')
    }
})

