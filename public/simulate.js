document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  if (startButton) {
    startButton.addEventListener("click", () => {
      window.location.href = "4-month.html"; // Naviga verso 4-month.html
    });
  }

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = event.data;

    if (message === "Start pressed!") {
      window.location.href = "4-month.html"; // Naviga verso 4-month.html
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

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

      videoElement.addEventListener("ended", () => {
        thumbnail.style.display = "block";
        videoElement.style.display = "none";
      });
    }
  }
});
