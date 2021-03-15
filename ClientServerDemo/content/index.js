alert("Hello, world!")

// define nested classes for testing
class TestEle {
    constructor() {
        this.name = 'test_element'
        this.e = 2.7183
    }
}

class TestObj {
    constructor() {
        this.name = 'just_a_random_string'
        this.num = 3100
        this.pi = 3.1416
        this.ele = new TestEle()
    }
}

// when button is clicked, send new TestObj to server and get back the modified object
$('#btn').click( () => {
    alert('OK!')
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/',
        data: JSON.stringify(new TestObj()),
        success: onsuccess,
        error: onerror
    })
})

function onsuccess(data) { //get back the modified object
    alert('post success!')
    alert(data.ele.name)
}

function onerror() {
    alert('post error...')
}