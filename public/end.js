document.addEventListener("DOMContentLoaded", () => {
  const thankYouContainer = document.querySelector(".thankyou-container");
  const logo = document.querySelector(".logo-big");

  // Funzione per gestire la dissolvenza
  function fadeIn(element, duration) {
    element.style.opacity = 0;
    element.style.display = "block";
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.min(progress / duration, 1);

      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  function fadeOut(element, duration) {
    element.style.opacity = 1;
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      element.style.opacity = Math.max(1 - progress / duration, 0);

      if (progress < duration) {
        requestAnimationFrame(step);
      } else {
        element.style.display = "none"; // Nascondi l'elemento dopo la dissolvenza
      }
    };

    requestAnimationFrame(step);
  }

  // Inizio della dissolvenza per il thank you container
  fadeIn(thankYouContainer, 2000);

  setTimeout(() => {
    fadeOut(thankYouContainer, 2000);
    setTimeout(() => {
      fadeIn(logo, 2000);
      setTimeout(() => {
        fadeOut(logo, 2000);
        setTimeout(() => {
          window.location.href = "1-index.html"; // Reindirizza alla pagina 1-index.html
        }, 5000); // Aspetta 5 secondi prima di reindirizzare
      }, 5000); // Aspetta 5 secondi prima di far apparire il logo
    }, 2000); // Aspetta 2 secondi dopo la dissolvenza del thank you container
  }, 5000); // Aspetta 5 secondi prima di iniziare la dissolvenza del thank you container
});
