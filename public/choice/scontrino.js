socket.onmessage = (event) => {
  const message = event.data;

  if (message === "Start pressed!") {
    const body = document.body;
    body.style.transition = "opacity 2s"; // Imposta la transizione per la dissolvenza
    body.style.opacity = 0; // Inizia la dissolvenza

    setTimeout(() => {
      window.location.href = "9-thankyou.html"; // Naviga verso thankyou.html
    }, 2000); // Aspetta 2 secondi prima di navigare
  }
};
