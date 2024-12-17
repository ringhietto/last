

socket.onopen = () => {
    console.log('WebSocket connected per cambiare pagina');
};

socket.onmessage = (event) => {
    console.log(event.data);
    if (event.data.includes("Start pressed!")) {
        window.location.href = "pagina2.html";
    }
};

socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
};

socket.onclose = () => {
    console.log('WebSocket connection closed');
};