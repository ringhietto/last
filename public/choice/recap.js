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
      window.location.href = "7a-etherea.html"; // Cambiato da "8-scontrino.html"
    }

    if (message === "Double press detected!") {
      const activeMonth = localStorage.getItem("selectedMonth");
      if (
        activeMonth === "JANUARY" ||
        activeMonth === "MARCH" ||
        activeMonth === "MAY" ||
        activeMonth === "JULY" ||
        activeMonth === "AUGUST" ||
        activeMonth === "OCTOBER" ||
        activeMonth === "DECEMBER"
      ) {
        window.location.href = "5-day-31.html";
      } else if (
        activeMonth === "JUNE" ||
        activeMonth === "APRIL" ||
        activeMonth === "SEPTEMBER" ||
        activeMonth === "NOVEMBER"
      ) {
        window.location.href = "5-day-30.html";
      } else if (activeMonth === "FEBRUARY") {
        window.location.href = "5-day-28.html";
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
