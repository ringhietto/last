document.addEventListener("DOMContentLoaded", () => {
  // Recupera l'anno selezionato da localStorage
  const selectedYear = localStorage.getItem("selectedYear");
  if (selectedYear) {
    document.querySelector("#year-name").textContent = selectedYear; // Imposta l'anno nel <span>
    console.log(selectedYear); // Log dell'anno selezionato
  }

  // Inizializza il WebSocket
  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = event.data;

    if (message === "Start pressed!") {
      window.location.href = "7a-etherea.html"; // Naviga verso 8-scontrino.html
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
