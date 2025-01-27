document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");
  const videoContainer = document.querySelector(".video-container");
  const video = document.getElementById("deathVideo");

  // Resetta l'array dei video visti ogni volta che la pagina viene caricata
  localStorage.setItem("watchedVideos", JSON.stringify([]));

  function getCurrentDeath() {
    const activeWord = document.querySelector(".word.active");
    return activeWord ? activeWord.textContent.toLowerCase() : "accident";
  }

  function isVideoWatched(deathType) {
    const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos"));
    return watchedVideos.includes(deathType);
  }

  function addToWatchedVideos(deathType) {
    const watchedVideos = JSON.parse(localStorage.getItem("watchedVideos"));
    if (!watchedVideos.includes(deathType)) {
      watchedVideos.push(deathType);
      localStorage.setItem("watchedVideos", JSON.stringify(watchedVideos));
    }
  }

  function updateSimulateButton() {
    const currentDeath = getCurrentDeath();
    const toSimulateElement = document.querySelector(".to-simulate");
    const dotElement = document.querySelector(".dot");
    if (isVideoWatched(currentDeath)) {
      toSimulateElement.innerHTML = "to BUY";
      dotElement.onclick = () => (window.location.href = "3a-date.html");
    } else {
      toSimulateElement.innerHTML = "to SIMULATE";
      dotElement.onclick = null;
    }
  }

  // Controlla lo stato iniziale al caricamento della pagina
  updateSimulateButton();

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    if (event.data.includes("Short press detected!")) {
      const currentDeath = getCurrentDeath();

      // Se il video è già stato visto, vai direttamente alla pagina di acquisto
      if (isVideoWatched(currentDeath)) {
        window.location.href = "3a-date.html";
        return;
      }

      video.querySelector("source").src = `asset/videos/${currentDeath}.mov`;
      video.load();

      // Mostra il container e imposta l'opacità iniziale a 0
      videoContainer.classList.add("active");
      videoContainer.style.opacity = "0";

      // Forza un reflow per assicurarsi che la transizione funzioni
      void videoContainer.offsetHeight;

      // Fade in del video con una transizione di 2 secondi
      videoContainer.style.transition = "opacity 2s ease-in-out";
      videoContainer.style.opacity = "1";

      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });

      // Aggiungi un listener per il timeupdate per gestire il fade out
      video.ontimeupdate = () => {
        // Se manca 1 secondo alla fine del video, inizia il fade out
        if (video.duration - video.currentTime <= 1) {
          // Rimuovi il listener per evitare chiamate multiple
          video.ontimeupdate = null;

          // Inizia il fade out
          videoContainer.style.transition = "opacity 1s ease-in-out";
          videoContainer.style.opacity = "0";
        }
      };

      // Quando il video finisce
      video.onended = () => {
        // Aggiungi il video alla lista dei visti
        addToWatchedVideos(currentDeath);

        // Aspetta che la transizione di fade out sia completata
        setTimeout(() => {
          videoContainer.classList.remove("active");
          video.currentTime = 0;
          updateSimulateButton();
        }, 1000); // Ridotto a 1000ms poiché il fade out inizia 1 secondo prima
      };
    }
  };

  // Aggiungi un listener per l'encoder che aggiorna il testo
  socket.addEventListener("message", (event) => {
    const encoderValue = parseInt(event.data.split(" ")[2]);
    if (!isNaN(encoderValue)) {
      updateSimulateButton();
    }
  });

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
