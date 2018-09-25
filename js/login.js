/* var socket = io.connect("nut.livfor.it:42069"); */
var socket = io.connect("localhost:42069");

var connectTimout = setTimeout(() => {
    document.getElementById("connected-text").innerText = "Can't connect to server."
    document.getElementById("connected-status").style.background = "#f44242";
}, 2000 /* Wait 2 seconds, if there is no connect, display the bad news. */);

socket.on("connect", () => {
    clearTimeout(connectTimout);
    document.getElementById("connected-text").innerText = "Connected to server!"
    document.getElementById("connected-status").style.background = "#38e241";
})

function get_details() {
    return {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
}

function test_account() {
    socket.emit("test", get_details());
}

socket.on("token", token => {
    localStorage.setItem("token", token);
    window.location.replace("home.html");
})

socket.on("test", exists => {
    document.getElementById("log").disabled = !exists;
    document.getElementById("sign").disabled = exists;

    if (get_details().username == "") {
        document.getElementById("log").disabled = true;
        document.getElementById("sign").disabled = true;
    } else if (exists) {
        document.getElementById("log").title = "Log in.";
        document.getElementById("sign").title = "This username is already taken.";
    } else {
        document.getElementById("log").title = "This username is not registered.";
        document.getElementById("sign").title = "Create account.";
    }
})

// Allow log-in / sign-up via enter click
document.addEventListener("keydown", e => {
    if(e.code == "Enter") {
        if(document.getElementById("log").disabled){
            sign_up();
        } else if (document.getElementById("sign").disabled){
            log_in();
        }
    }
})

function sign_up() {
    socket.emit("sign_up", get_details());
}

function log_in(){
    socket.emit("log_in", get_details());
}

socket.on("err", err => {
    alert(err); // TODO: Better error display.
})