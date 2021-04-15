$('#change').click(() => {

    var opw = $('#opassword').val()
    var npw = $('#npassword').val()
    var cpw = $('#cpassword').val()
    //alert("" + opw + '\n' + npw + '\n' + cpw)

    if (opw == '' || npw == "" || cpw == '') {
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
    hashObj.update(opw);
    var ohash = hashObj.getHash("HEX");
    hashObj = new jsSHA("SHA-256", "TEXT", { numRounds: 1 });
    hashObj.update(npw);
    var nhash = hashObj.getHash("HEX");

    var message = {
        ohash: ohash,
        nhash: nhash,
    }
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/change_pw',
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })
    function onsuccess(data) {
        if (data.respondCode == 1) {
            // change password hash cookie (hardcode the expire date as 2022/01/01 for now),
            // set path to root so every page can access
            document.cookie = "pwhash=" + nhash + "; expires=Sat, 01 Jan 2022 00:00:00 GMT; path=/"
            // redirect to the main page
            window.location.href = "/profile/"
        }
        else if (data.respondCode == 0){
            alert("Error: wrong old password")
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