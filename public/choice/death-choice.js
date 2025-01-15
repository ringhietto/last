document.addEventListener("DOMContentLoaded", () => {
  const words = document.querySelectorAll(".word");
  const circle = document.querySelector(".circle");
  const xOffset = -860; // Offset orizzontale per centrare le parole SINISTRA-DESTRA
  const yOffset = -1650; // Offset verticale per posizionare le parole sopra il cerchio SU-GIU
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
    const radius = 900; // Imposta il raggio per posizionare le parole vicino al cerchio
    const activeFontSize = 2.5; // Dimensione della parola attiva in em
    const normalFontSize = 1.04; // Dimensione della parola normale in em

    // Modifica i valori di distanza per avvicinare le parole
    const distanceActive = activeFontSize * 10; // Distanza per la parola attiva
    const distanceNormal = normalFontSize * 5; // Distanza per le parole normali

    words.forEach((word, index) => {
      const relativeIndex =
        (index - currentIndex + words.length) % words.length;
      const angle = angleStep * relativeIndex - 180.32; // Angolo per rotazione orizzontale

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
        word.classList.remove("font-regular");
        word.classList.add("font-DemiBold");
        gsap.to(word, { fontSize: "2.5em", duration: 0.5 }); // Dimensione per la parola attiva
        loadVip(word.textContent.toLowerCase()); // Chiama la funzione loadVip
        loadPhrases(word.textContent.toLowerCase()); // Chiama la funzione loadPhrases
        updateMedia(word.textContent.toLowerCase()); // Aggiorna l'immagine e il video
      } else {
        word.classList.remove("active");
        word.classList.add("font-regular");
        word.classList.remove("font-DemiBold");
        gsap.to(word, { fontSize: "1.04em", duration: 0.5 }); // Dimensione per la parola non attiva
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

  words.forEach((word) => {
    word.addEventListener("click", () => {
      const selectedDeath = word.textContent; // Ottieni il tipo di morte selezionato
      localStorage.setItem("selectedDeath", selectedDeath); // Salva il tipo di morte selezionato
      console.log("Morte selezionata:", selectedDeath); // Log per confermare la selezione
    });
  });

  function updateDeath(death) {
    console.log("Morte selezionata:", death);
    localStorage.setItem("selectedDeath", death); // Salva il tipo di morte selezionato
  }
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

function updateMedia(word) {
  const videoContainer = document.getElementById("videoContainer");
  const thumbnail = document.getElementById("videoThumbnail");
  const videoElement = document.getElementById("accidentVideo");

  // Aggiorna l'immagine di anteprima
  thumbnail.src = `asset/stopvideo/${word}.png`;

  // Aggiorna il video
  videoElement.querySelector("source").src = `asset/videos/${word}.mp4`;
  videoElement.load(); // Ricarica il video per applicare la nuova sorgente
}
