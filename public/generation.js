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

  fetch(`vip/${vipType.toLowerCase()}.json`)
    .then(response => response.json())
    .then(data => {
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
        });
      }
    })
    .catch(error => console.error('Errore nel caricare il JSON:', error));
}