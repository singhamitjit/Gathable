$('#confirm').click(() => {
    
    var npw = $('#password').val()
    var cpw = $('#cpassword').val()

    if (npw == "" || cpw == "") {
        return
    }
    var msg
    msg = checkPassword(npw)
    if (msg != "") {
        alert(msg)
        return
    }
    if (npw != cpw) {
        alert("error: password and confirm password should be the same")
        return
    }

    // hash the password
    var hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 }); // numRounds: how many hash iterations, 1 is okay
    hashObj.update(npw);
    var pwHash = hashObj.getHash("HEX");

    var message = {
        pwHash: pwHash,
        urlp: window.location.search
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })
    function onsuccess(data) {
        if (data.respondCode == 1) {
            alert("Successful Reset! Redirecting to login page...")
            window.location.href = "/login/"
        }
        else {
            alert(data.message)
            badCookies()
        }
    }
    function onerror() {
        alert('failed to connect to server...')
        window.location.href = "/"
    }
})