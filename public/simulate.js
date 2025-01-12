
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
