function loadPhrases(deathType) {
  fetch(`consequence/${deathType}.json`)
    .then((response) => response.json())
    .then((data) => {
      const generationContainer = document.querySelector(".consequence h1");
      const randomPhrase =
        data.phrases[Math.floor(Math.random() * data.phrases.length)];

      // Impostiamo il testo della frase
      generationContainer.textContent = randomPhrase;

      // Rimuoviamo l'eventuale classe di animazione precedente
      generationContainer.classList.remove("fade-in", "typing");

      // Forziamo il reflow per riavviare l'animazione
      void generationContainer.offsetWidth;

      // Aggiungiamo la classe di animazione "typing"
      generationContainer.classList.add("typing");
    })
    .catch((error) => console.error("Errore nel caricare il JSON:", error));
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
