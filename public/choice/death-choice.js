document.addEventListener("DOMContentLoaded", () => {
  const words = document.querySelectorAll(".word");
  const circle = document.querySelector(".circle");
  const xOffset = -955; // Offset orizzontale per centrare le parole SINISTRA-DESTRA
  const yOffset = -1650; // Offset verticale per posizionare le parole sopra il cerchio SU-GIU
  let centerX, centerY;
  let currentIndex = 8; // La terza parola ("Overdose") è al centro inizialmente
  let lastEncoderValue = 0; // Valore dell'encoder precedente
  const toSimulateDiv = document.querySelector(".to-simulate");
  let isInBuyState = false; // Nuovo stato per tracciare se siamo in modalità "BUY"

  // Mantieni la dissolvenza iniziale
  const thumbnail = document.getElementById("imageThumbnail");
  gsap.fromTo(thumbnail, { opacity: 0 }, { opacity: 1, duration: 1 });

  function updateCenter() {
    const circle = document.querySelector(".circle");
    if (!circle) {
      console.error("Elemento .circle non trovato nel DOM.");
      return; // Esci dalla funzione se l'elemento non esiste
    }

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
        updateDeath(word.textContent); // Modificato per chiamare updateDeath qui
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
    if (isInBuyState) {
      document.querySelector(".to-simulate").innerHTML = "to SIMULATE";
      isInBuyState = false;
    }
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

    if (event.data.includes("Start pressed!")) {
      if (isInBuyState) {
        window.location.href = "3a-date.html";
        return;
      }

      const video = document.getElementById("deathVideo");
      const videoContainer = document.querySelector(".video-container");

      // Imposta il video corretto
      const currentDeath = getCurrentDeath();
      video.querySelector("source").src = `asset/videos/${currentDeath}.mov`;
      video.load();

      // Mostra e riproduci il video
      videoContainer.classList.add("active");
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });

      // Quando il video finisce
      video.addEventListener(
        "ended",
        () => {
          videoContainer.classList.remove("active");
          document.querySelector(".to-simulate").innerHTML = "to BUY";
          isInBuyState = true;
        },
        { once: true }
      ); // Assicura che l'evento venga gestito una sola volta
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  // words.forEach((word) => {
  //   word.addEventListener("click", () => {
  //     const selectedDeath = word.textContent;
  //     localStorage.setItem("selectedDeath", selectedDeath);
  //     console.log("Morte selezionata:", selectedDeath);
  //     window.location.href = "4-month.html"; // Aggiunto per reindirizzare alla pagina "4-month.html"
  //   });
  // });

  function updateDeath(death) {
    console.log("Morte selezionata:", death);
    localStorage.setItem("selectedDeath", death); // Salva il tipo di morte selezionato
  }

  updateMedia("suicide"); // Imposta 'suicide' come immagine iniziale
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
  const videoElements = document.querySelectorAll(".deathVideo");
  const videoContainer = document.getElementById("imageContainer");
  const thumbnail = document.getElementById("imageThumbnail");

  // Nascondi tutti i video
  videoElements.forEach((video) => {
    video.style.display = "none";
  });

  // Mostra il video corretto
  const selectedVideo = document.getElementById(`${word}Video`);
  if (selectedVideo) {
    selectedVideo.style.display = "block";
    selectedVideo.load();
    selectedVideo.play().catch((error) => {
      console.error(`Error playing video for ${word}:`, error);
    });
  } else {
    console.error(`Video per ${word} non trovato.`);
  }

  // Aggiorna immediatamente l'immagine di anteprima
  thumbnail.src = `asset/stopvideo/${word}.png`;
  thumbnail.style.opacity = 1; // Rimuovi il delay e imposta l'opacità immediatamente
  thumbnail.classList.add("fade-in-out");
}

// Funzione helper per ottenere la morte attualmente selezionata
function getCurrentDeath() {
  const activeWord = document.querySelector(".word.active");
  return activeWord ? activeWord.textContent.toLowerCase() : "accident";
}
