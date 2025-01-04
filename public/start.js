document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    if (event.data.includes("Start pressed!")) {
      window.location.href = "pagina2.html";
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});

// Funzione per gestire il passaggio alla pagina2.html
function handleStartPress() {
  window.location.href = "pagina2.html";
}

// Aggiungi un listener per il messaggio dal monitor seriale
function listenForSerial() {
  // Supponendo che tu stia usando una libreria per la comunicazione seriale
  serial.on("data", function (data) {
    if (data.includes("Start pressed!")) {
      handleStartPress();
    }
  });
}

// Inizializza la comunicazione seriale
listenForSerial();
