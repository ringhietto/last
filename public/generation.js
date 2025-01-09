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
  const generationContainer = document.querySelector(".just-like h4");
  const videoContainer = document.querySelector(".video");
  const instructions = document.querySelector(".instructions");
  const circle = document.querySelector(".circle");
  const choice = document.querySelector(".choice");

  // Assicurati che il video sia nascosto all'inizio
  videoContainer.style.display = "none"; // Nascondi il video all'inizio

  fetch(`vip/${vipType.toLowerCase()}.json`)
    .then((response) => response.json())
    .then((data) => {
      const phrase = data.phrase;

      if (phrase) {
        // Rimuoviamo l'eventuale classe di animazione precedente
        generationContainer.classList.remove("fade-in");

        // Nascondiamo il testo
        generationContainer.style.opacity = "0";

        // Utilizziamo requestAnimationFrame per garantire la precisione dell'animazione
        requestAnimationFrame(() => {
          // Impostiamo il testo
          generationContainer.textContent = phrase;

          // Aggiungiamo la classe fade-in per la transizione
          generationContainer.classList.add("fade-in");
          generationContainer.style.opacity = "1"; // Mostra il testo

          // Aggiungi un ritardo di 1 secondo prima di mostrare il video
          setTimeout(() => {
            videoContainer.style.display = "block"; // Cambia il display a block
            gsap.fromTo(
              videoContainer,
              { opacity: 0 },
              { opacity: 1, duration: 1 }
            ); // Fade-in con GSAP
          }, 1000); // Ritardo di 1 secondo

          // Animazione per le istruzioni dopo 4 secondi
          setTimeout(() => {
            gsap.fromTo(
              instructions,
              { opacity: 0 },
              { opacity: 1, duration: 1 }
            );
          }, 100); // Ritardo di 4 secondi

          // Animazione per la scelta dopo 6 secondi
          setTimeout(() => {
            gsap.fromTo(choice, { opacity: 0 }, { opacity: 1, duration: 1 });
          }, 1000); // Ritardo di 6 secondi

          // Animazione per il cerchio dopo 8 secondi
          setTimeout(() => {
            gsap.fromTo(
              circle,
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: 1 }
            ); // Fade-in e scaling
          }, 1000); // Ritardo di 8 secondi
        });
      }
    })
    .catch((error) => console.error("Errore nel caricare il JSON:", error));
}
