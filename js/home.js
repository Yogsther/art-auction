/* var socket = io.connect("nut.livfor.it:42069"); */
var socket = io.connect("localhost:42069");
var account;

if(localStorage.getItem("token") == undefined){
    window.location.replace("index.html");
} else {
    // Attempt to login
    socket.emit("log_in", {token: localStorage.getItem("token")})
}


function update_display(){
    document.getElementById("username-header").innerText = account.username;
    document.getElementById("wallet-display").innerText = "€" + account.wallet.toString();
}

socket.on("credentials", credentials => {
    // Login process
    account = credentials;

    update_display();
})

function logout(){
    localStorage.removeItem("token");
    window.location.replace("index.html");
}