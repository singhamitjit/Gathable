var uId
var uName
var uEmail

$.ajax({
    type: 'POST',
    contentType: "application/json",
    url: '/profile',
    success: onsuccess,
    error: onerror
})

function onsuccess(data) {
    if (data.respondCode == 1) {
        uId = data.uid
        uName = data.uname
        uEmail = data.uemail
        displayInfo()
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

function displayInfo() {
    document.getElementById("uid").innerHTML = uId;
    document.getElementById("uname").innerHTML = uName;
    document.getElementById("uemail").innerHTML = uEmail;
}