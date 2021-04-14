// send cookies to server first
$.ajax({
    type: 'POST',
    contentType: "application/json",
    url: '/home',
    success: onsuccess,
    error: onerror
})

var username, email

function onsuccess(data) {
    if (data.respondCode == 1) {
        username = data.username
        email = data.email
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

document.getElementById("username").innerHTML = username
document.getElementById("email").innerHTML = email