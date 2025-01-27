const deathPhrases = {
  accident: '"A CRUEL AND SUDDEN FATE."',
  murder: '"AN INJUSTICE THAT CRIES FOR REVENGE."',
  illness: '"AN EXAMPLE OF STRENGTH AND DIGNITY."',
  suicide: '"A VOID THAT LEAVES TOO MANY QUESTIONS."',
  overdose: '"A LIFE LIVED TO THE FULLEST, CUT SHORT BY EXCESS."',
};

function loadPhrases(deathType) {
  const generationContainer = document.querySelector(".consequence h1");

  // Prendiamo la frase corrispondente al tipo di morte
  const phrase = deathPhrases[deathType.toLowerCase()];

  // Impostiamo il testo della frase
  generationContainer.textContent = phrase;

  // Rimuoviamo l'eventuale classe di animazione precedente
  generationContainer.classList.remove("fade-in");

  // Forziamo il reflow per riavviare l'animazione
  void generationContainer.offsetWidth;

  // Aggiungiamo la classe fade-in
  generationContainer.classList.add("fade-in");
}

function loadVip(vipType) {
  const videoContainer = document.querySelector(".video");
  const instructions = document.querySelector(".instructions");
  const circle = document.querySelector(".circle");
  const choice = document.querySelector(".choice");

  // Assicurati che il video sia nascosto all'inizio
  videoContainer.style.display = "none";

  // Mostra il video senza animazione
  videoContainer.style.display = "block";

  // Animazione per le istruzioni
  setTimeout(() => {
    instructions.style.opacity = "1"; // Imposta l'opacità a 1 senza animazione
  }, 100);

  // Animazione per la scelta
  setTimeout(() => {
    choice.style.opacity = "1"; // Imposta l'opacità a 1 senza animazione
  }, 1000);

  // Animazione per il cerchio
  setTimeout(() => {
    circle.style.opacity = "1"; // Imposta l'opacità a 1 senza animazione
    circle.style.transform = "scale(1)"; // Imposta la scala a 1 senza animazione
  }, 1000);
}

function pulseInstructions() {
  const dateInstructions = document.querySelector(".date-instructions");

  // Verifica che l'elemento esista
  if (!dateInstructions) return;

  // Imposta l'opacità iniziale a 1
  dateInstructions.style.opacity = "1";

  // Funzione per gestire la pulsazione
  function pulse() {
    // Fade out a 0 con ease
    gsap.to(dateInstructions, {
      opacity: 0,
      duration: 1,
      ease: "ease",
      yoyo: true, // Fa tornare automaticamente al valore iniziale
      repeat: -1, // Ripete all'infinito
      repeatDelay: 0, // Nessuna pausa tra le ripetizioni
    });
  }

  // Inizia la pulsazione dopo 5 secondi
  setTimeout(pulse, 500);
}

function pulseSimulateInstructions() {
  const simulateInstructions = document.querySelector(".instructions");
  const press = document.querySelector(".press");
  const dot = document.querySelector(".dot");
  const toSimulate = document.querySelector(".to-simulate");

  // Verifica che gli elementi esistano
  if (!simulateInstructions || !press || !dot || !toSimulate) return;

  // Imposta l'opacità iniziale a 1 per tutti gli elementi
  [press, dot, toSimulate].forEach((el) => {
    el.style.opacity = "1";
  });

  // Funzione per gestire la pulsazione
  function pulse() {
    // Anima tutti gli elementi insieme
    [press, dot, toSimulate].forEach((el) => {
      gsap.to(el, {
        opacity: 0,
        duration: 1,
        ease: "ease",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0,
      });
    });
  }

  // Inizia la pulsazione dopo 5 secondi
  setTimeout(pulse, 500);
}

// Chiama entrambe le funzioni quando il documento è caricato
document.addEventListener("DOMContentLoaded", () => {
  pulseInstructions();
  pulseSimulateInstructions();
});
