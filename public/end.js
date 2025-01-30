document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");

  // Se siamo nella pagina scontrino
  if (window.location.pathname.includes("8-scontrino")) {
    socket.onmessage = (event) => {
      if (event.data === "Short press detected!") {
        window.location.href = "9-thankyou.html";
      }
    };
  }

  // Se siamo nella pagina thank you
  if (window.location.pathname.includes("9-thankyou")) {
    socket.onmessage = (event) => {
      if (event.data === "Video pressed!") {
        // Fade out prima di reindirizzare
        document.body.style.transition = "opacity 2s";
        document.body.style.opacity = "0";

        setTimeout(() => {
          window.location.href = "10-end.html";
        }, 2000);
      }
    };
  }

  // Se siamo nella pagina end con il video
  if (window.location.pathname.includes("10-end")) {
    const video = document.getElementById("endVideo");

    // Assicurati che il video sia caricato
    video.load();

    // Gestisci gli errori di caricamento
    video.onerror = (e) => {
      console.error("Errore nel caricamento del video:", e);
    };

    // Quando il video è pronto
    video.oncanplay = () => {
      // Riproduci il video
      video.play().catch((error) => {
        console.error("Errore nella riproduzione:", error);
      });
    };

    // Quando il video finisce
    video.onended = () => {
      document.body.style.transition = "opacity 2s";
      document.body.style.opacity = "0";

      setTimeout(() => {
        window.location.href = "1-index.html";
      }, 2000);
    };
  }
});
