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

    if (message === "Short press detected!") {
      // Aggiungi la dissolvenza in uscita
      const body = document.body;
      body.style.transition = "opacity 2s";
      body.style.opacity = 0;

      setTimeout(() => {
        window.location.href = "7a-etherea.html";
      }, 2000);
    }

    if (message === "Double press detected!") {
      const selectedMonth = localStorage.getItem("selectedMonth");
      if (selectedMonth === "JANUARY") {
        window.location.href = "6-year-january.html";
      } else {
        window.location.href = "6-year.html";
      }
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
