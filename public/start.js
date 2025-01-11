document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    if (event.data.includes("Short press detected!")) {
      startVideo();
    } else if (event.data.includes("Double press detected!")) {
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

// Funzione per avviare il video
function startVideo() {
  const videoElement = document.getElementById("accidentVideo");
  const thumbnail = document.getElementById("videoThumbnail");

  if (videoElement) {
    videoElement.style.display = "block";
    thumbnail.style.display = "none";
    videoElement
      .play()
      .then(() => {
        console.log("Video avviato con successo.");
      })
      .catch((error) => {
        console.error("Errore durante l'avvio del video:", error);
      });

    // Aggiungi un listener per l'evento 'ended'
    videoElement.addEventListener("ended", () => {
      thumbnail.style.display = "block";
      videoElement.style.display = "none";
    });
  } else {
    console.error("Elemento video non trovato.");
  }
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
