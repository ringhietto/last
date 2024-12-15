// start.js

function connectWebSocket() {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(`Received data: ${JSON.stringify(data)}`); // Aggiungi questo log
        if (data.type === 'start-state' && data.Start_State) {
            window.location.href = 'pagina2.html';
        }
    };

    ws.onclose = () => {
        console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
}

if (sessionStorage.getItem('serialConnected') === 'true') {
    connectWebSocket();
}

document.addEventListener('DOMContentLoaded', () => {
    const backgroundDiv = document.getElementById('connectButton');

    if (backgroundDiv) {
        backgroundDiv.addEventListener('click', () => {
            sessionStorage.setItem('serialConnected', 'true');
            window.location.href = 'pagina2.html';
        });
    } else {
        console.error('Element with id "connectButton" not found.');
    }
});
