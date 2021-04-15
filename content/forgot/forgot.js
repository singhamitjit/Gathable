$('#confirm').click(() => {

    var email = $('#email').val()
    
    if (email == "")
        return

    if (checkEmail(email) != "") {
        alert("Error: incorrect email format")
        return
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/forgot',
        data: JSON.stringify({email: email}),
        success: onsuccess,
        error: onerror
    })

    function onsuccess(data) {
        if (data.respondCode != 1) { // not successful
            alert(data.message)
        }
        else {
            alert("Submitted! Please check your email for the reset password link.")
            window.location.href = "/login/"
        }
    }

    function onerror() {
        alert('failed to connect to server...')
    }
})