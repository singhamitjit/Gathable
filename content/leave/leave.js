$('#back').click(() => {
    window.location.href = "/group_tb/" + window.location.search
})

$('#leave').click(() => {
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/leave/' + window.location.search,
        success: onsuccess,
        error: onerror
    })

    function onsuccess(data) {
        if (data.respondCode != 1) {
            alert(data.message)
            badCookies()
        }
        else {
            window.location.href = "/groups/"
        }
    }

    function onerror() {
        alert('failed to connect to server...')
        window.location.href = "/"
    }
})