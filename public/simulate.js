const socket = new WebSocket("ws://127.0.0.1:8001");

socket.onmessage = (event) => {
  console.log("Message from server:", event.data);

  // Gestisci solo un tipo di messaggio alla volta
  if (event.data.includes("Double press detected!")) {
    window.location.href = "pagina4.html";
  } else if (event.data.includes("Short press detected!")) {
    startVideo();
  }
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
