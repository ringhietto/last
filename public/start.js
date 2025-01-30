document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const fadeElements = document.querySelectorAll(".fade-in");

  // Dopo un breve delay, inizia la transizione
  setTimeout(() => {
    body.style.backgroundColor = "white";
    fadeElements.forEach((el) => {
      el.style.opacity = "1";
    });
  }, 500);

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = event.data;

    if (message === "Buy pressed!") {
      const body = document.body;
      body.style.transition = "opacity 2s"; // Imposta la transizione per la dissolvenza
      body.style.opacity = 0; // Inizia la dissolvenza

      setTimeout(() => {
        window.location.href = "2-onboarding.html"; // Naviga verso 2-onboarding.html
      }, 2000); // Aspetta 2 secondi prima di navigare
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});

// // Funzione per avviare il video
// function startVideo() {
//   const videoElement = document.getElementById("accidentVideo");
//   const thumbnail = document.getElementById("videoThumbnail");

//   if (videoElement) {
//     videoElement.style.display = "block";
//     thumbnail.style.display = "none";
//     videoElement
//       .play()
//       .then(() => {
//         console.log("Video avviato con successo.");
//       })
//       .catch((error) => {
//         console.error("Errore durante l'avvio del video:", error);
//       });

//     // Aggiungi un listener per l'evento 'ended'
//     videoElement.addEventListener("ended", () => {
//       thumbnail.style.display = "block";
//       videoElement.style.display = "none";
//     });
//   } else {
//     console.error("Elemento video non trovato.");
//   }
// }
