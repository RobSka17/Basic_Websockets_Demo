const socket = new WebSocket("ws://localhost:8080");
var connectionStatus;

socket.onopen = function(e) {
    connectionStatus = "open";
};

socket.onclose = function(e) {
    if(e.wasClean) {
        connectionStatus = "closed";
    }
    else {
        connectionStatus = "died";
    }
};

socket.onmessage = function(e) {
    var chatArea = $("#chatArea");
    var chatAreaHtml = chatArea.html();
    var obj = JSON.parse(e.data);
    switch(obj.type) {
        case "message":
            chatArea.html(chatAreaHtml + "<span>" + obj.data + "</span><br>");
            break;
        case "connectedMessage":
            chatArea.html(chatAreaHtml + '<span style="color:green;">' + obj.data + '</span><br>');
            break;
    }
};

function sendMessage() {
    var message = $("#chatInput").val();
    var messageObj = { "type": "message", "data": message };
    $("#chatInput").val("");
    if(connectionStatus == "open") {
        socket.send(JSON.stringify(messageObj));
    }
};