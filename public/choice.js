document.addEventListener("DOMContentLoaded", () => {
  const words = document.querySelectorAll(".word");
  const circle = document.querySelector(".circle");
  const radius = 100; // Raggio della semicirconferenza ridotto
  const xOffset = -860; // Offset orizzontale per centrare le parole SINISTRA-DESTRA
  const yOffset = -620; // Offset verticale per posizionare le parole sopra il cerchio SU-GIU
  let centerX, centerY;
  let currentIndex = 8; // La terza parola ("Overdose") è al centro inizialmente
  let lastEncoderValue = 0; // Valore dell'encoder precedente

  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / words.length; // Cambiato per coprire l'intero cerchio
    const radius = 950; // Imposta il raggio per posizionare le parole vicino al cerchio
    const activeFontSize = 2.5; // Dimensione della parola attiva in em
    const normalFontSize = 1; // Dimensione della parola normale in em

    // Modifica i valori di distanza per avvicinare le parole
    const distanceActive = activeFontSize * 10; // Distanza per la parola attiva
    const distanceNormal = normalFontSize * 5; // Distanza per le parole normali

    words.forEach((word, index) => {
      const relativeIndex =
        (index - currentIndex + words.length) % words.length;
      const angle = angleStep * relativeIndex - 180; // Angolo per rotazione orizzontale

      // Calcola la distanza in base alla dimensione del font
      const distance = relativeIndex === 5 ? distanceActive : distanceNormal;

      const x =
        centerX +
        (radius + distance) * Math.cos((angle * Math.PI) / 180) +
        xOffset; // Aggiungi distanza
      const y =
        centerY +
        (radius + distance) * Math.sin((angle * Math.PI) / 180) +
        yOffset; // Aggiungi distanza

      const opacity =
        relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1;

      word.style.transform = `translate(${x}px, ${y}px)`;
      word.style.opacity = opacity;

      if (relativeIndex === 5) {
        word.classList.add("active");
        gsap.to(word, { fontSize: "2.5em", duration: 0.5 }); // Animazione per la parola attiva
        loadVip(word.textContent.toLowerCase()); // Chiama la funzione loadVip
        loadPhrases(word.textContent.toLowerCase()); // Chiama la funzione loadPhrases
      } else {
        word.classList.remove("active");
        gsap.to(word, { fontSize: "1.5em", duration: 0.5 }); // Animazione per la parola non attiva
      }
    });
  }

  function rotateWords(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + words.length) % words.length;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % words.length;
    }
    updatePositions();
  }

  // Inizializza la posizione iniziale
  updateCenter();

  window.addEventListener("resize", updateCenter); // Riposiziona le parole al ridimensionamento della finestra

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const encoderValue = parseInt(event.data.split(" ")[2]);
    if (!isNaN(encoderValue)) {
      if (encoderValue > lastEncoderValue) {
        rotateWords("right");
      } else if (encoderValue < lastEncoderValue) {
        rotateWords("left");
      }
      lastEncoderValue = encoderValue;
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});

function animateRotation() {
  if (currentIndex !== targetIndex) {
    currentIndex =
      (currentIndex + (targetIndex > currentIndex ? 1 : -1) + words.length) %
      words.length;
    updatePositions();
    requestAnimationFrame(animateRotation);
  }
}
