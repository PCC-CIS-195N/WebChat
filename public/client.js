function init() {
    const nameInput = document.getElementById('nameInput');
    const namePanel = document.getElementById('namePanel');

    nameInput.focus();

    nameInput.addEventListener('keyup', (evt) => {
        if (evt.code == 'Enter' || evt.code == 'NumpadEnter') {
            console.log("Name:", nameInput.value);
            namePanel.style.display = 'none';
            nameEntered(nameInput.value);
        }
    });
}

function nameEntered(name) {
    const MSG_SEPARATION_TIME = 3600000; // One hour in milliseconds
    const inputLine = document.getElementById('inputLine');
    const chat = document.getElementById('chatText');

    inputLine.focus();

    function formatDate(time) {
        const date = new Date(time);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()},`
            + ` ${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
    }

    function escapeHTML(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    window.addEventListener('resize', () => {
        chat.scrollTop = chat.scrollHeight;
    });

    console.log("Init called.");
    // Create WebSocket connection.
    const socket = new WebSocket('ws://localhost:3001/');

    // Connection opened
    socket.addEventListener('open', function (event) {
        let previousSender;
        let previousTime = 0;

        // Listen for messages
        socket.addEventListener('message', function (event) {
            console.log('Message from server ', event.data);
            let msg = JSON.parse(event.data);
            let line;
            let color;
            let sender;
            let dateString = formatDate(msg.time);

            switch (msg.type) {
                case 'post':
                    sender = escapeHTML(msg.name);
                    color = (name == sender) ? "lightgreen" : "yellow";
                    line = escapeHTML(msg.post);
                    break;
                case 'join':
                    sender = "system";
                    color = "red";
                    line = `### ${escapeHTML(msg.name)} has joined the chat.`;
                    break;
                case 'leave':
                    sender = "system";
                    color = "red";
                    line = `### ${escapeHTML(msg.name)} has left the chat.`;
                    break;
                case 'end': // end of log history, time to send join message.
                    socket.send(`{"type":"join","name":"${name}"}`);
                    break;
            }
            console.log(previousTime, msg.time, msg.time - previousTime);
            if (msg.type != 'end') {
                if (sender == previousSender && msg.time - previousTime < MSG_SEPARATION_TIME) {
                    chat.innerHTML += '<br>' + line;
                } else {
                    chat.innerHTML += `<br><br><span style='color:${color};'>${dateString} - ${sender}:</span><br>` + line;
                }
                previousSender = sender;
                previousTime = msg.time;
            }
            chat.scrollTop = chat.scrollHeight;
        });

        window.addEventListener('beforeunload', () => {
            socket.send(JSON.stringify({
                type: 'leave',
                name: name
            }));
        });

        inputLine.addEventListener('keyup', (evt) => {
            if (evt.code == 'Enter' || evt.code == 'NumpadEnter') {
                console.log("Line:", inputLine.value);
                socket.send(JSON.stringify({
                    type: 'post',
                    name: name,
                    post: inputLine.value
                }));
                inputLine.value = "";
            }
        });
    });
}