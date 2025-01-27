document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");

  // Se siamo nella pagina scontrino
  if (window.location.pathname.includes("8-scontrino")) {
    socket.onmessage = (event) => {
      if (event.data === "Buy pressed!") {
        window.location.href = "9-thankyou.html";
      }
    };
  }

  // Se siamo nella pagina thank you
  if (window.location.pathname.includes("9-thankyou")) {
    socket.onmessage = (event) => {
      if (event.data === "Buy pressed!") {
        window.location.href = "10-end.html";
      }
    };
  }

  // Se siamo nella pagina end con il video
  if (window.location.pathname.includes("10-end")) {
    const video = document.getElementById("endVideo");

    video.addEventListener("ended", () => {
      const body = document.body;
      body.style.transition = "opacity 2s";
      body.style.opacity = 0;

      setTimeout(() => {
        window.location.href = "1-index.html";
      }, 2000);
    });
  }
});
