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

  // Mostra il video dopo 1 secondo
  setTimeout(() => {
    videoContainer.style.display = "block";
    gsap.fromTo(
      videoContainer,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );
  }, 1000);

  // Animazione per le istruzioni
  setTimeout(() => {
    gsap.fromTo(
      instructions,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );
  }, 100);

  // Animazione per la scelta
  setTimeout(() => {
    gsap.fromTo(choice, { opacity: 0 }, { opacity: 1, duration: 1 });
  }, 1000);

  // Animazione per il cerchio
  setTimeout(() => {
    gsap.fromTo(
      circle,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 1 }
    );
  }, 1000);
}
