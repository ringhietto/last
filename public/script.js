document.addEventListener("DOMContentLoaded", () => {
  const words = document.querySelectorAll(".word");
  const circle = document.querySelector(".circle");
  const radius = 400; // Raggio della semicirconferenza ridotto
  const xOffset = -530; // Offset orizzontale per spostare le parole a destra (valore positivo) o a sinistra (valore negativo)
  const yOffset = -480; // Offset orizzontale per spostare le parole a destra (valore positivo) o a sinistra (valore negativo)
  let centerX, centerY;
  let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente
  let lastEncoderValue = 0;

  // Funzione per aggiornare il centro della semicirconferenza
  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions(); // Aggiorna le posizioni delle parole
  }

  // Funzione per calcolare e posizionare le parole
  function updatePositions() {
    const angleStep = 180 / (words.length - 1); // Calcola l'angolo tra ogni parola

    words.forEach((word, index) => {
      const relativeIndex =
        (index - currentIndex + words.length) % words.length; // Indice ciclico per il corretto posizionamento
      const angle = angleStep * relativeIndex - 90; // Angolo rispetto al centro (da -90° a +90°)

      const x = centerX + radius * Math.cos((angle * Math.PI) / 180) + xOffset;
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180) + yOffset;

      // Configura l'opacità
      const opacity =
        relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1; // Le parole più esterne sono nascoste

      // Applicazione delle trasformazioni
      word.style.transform = `translate(${x}px, ${y}px)`;
      word.style.opacity = opacity;

      // Aggiungi o rimuovi la classe "active" per la parola centrale
      if (relativeIndex === 2) {
        word.classList.add("active");
      } else {
        word.classList.remove("active");
      }
    });
  }

  function rotateWords(direction) {
    if (direction === "left") {
      // Quando vai a sinistra
      if (currentIndex === 0) return; // Ferma al primo elemento
      if (currentIndex === 1 && lastEncoderValue < 1) return;
      currentIndex = (currentIndex - 1 + words.length) % words.length;
    } else if (direction === "right") {
      // Quando vai a destra
      if (currentIndex === words.length - 2) return; // Ferma al penultimo elemento
      if (currentIndex === words.length - 1 && lastEncoderValue > words.length - 1) return;
      currentIndex = (currentIndex + 1) % words.length;
    }
    lastEncoderValue = currentIndex;
    updatePositions();
  }

  // Inizializza la posizione iniziale
  updateCenter();

  window.addEventListener("resize", updateCenter); // Riposiziona le parole al ridimensionamento della finestra

  gsap.to(circle, {
    rotation: "+=360", // Incrementa la rotazione continuamente
    duration: 5, // Durata della rotazione completa
    repeat: -1, // Ripetizione infinita
    ease: "linear", // Movimento costante senza accelerazioni
    modifiers: {
      rotation: gsap.utils.wrap(0, 360), // Mantiene la rotazione tra 0 e 360
    },
  });
});
