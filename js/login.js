/* var socket = io.connect("nut.livfor.it:42069"); */
var socket = io.connect("localhost:42069");

function get_details() {
    return {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
}

function test_account() {
    socket.emit("test", get_details());
}

socket.on("test", exists => {
    document.getElementById("log").disabled = !exists;
    document.getElementById("sign").disabled = exists;

    if(exists){
        document.getElementById("log").title = "Log in.";
        document.getElementById("sign").title = "This username is already taken.";
    } else {
        document.getElementById("log").title = "This username is not registered.";
        document.getElementById("sign").title = "Create account.";
    }
})

function sign_up(){
    socket.emit("sign_up", get_details());
}

socket.on("err", err => {
    alert(err); // TODO: Better error display.
})