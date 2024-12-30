function loadPhrases(deathType) {
    fetch(`consequence/${deathType}.json`)
        .then(response => response.json())
        .then(data => {
            const generationContainer = document.querySelector('.consequence h2');
            const randomPhrase = data.phrases[Math.floor(Math.random() * data.phrases.length)];

            // Impostiamo il testo della frase
            generationContainer.textContent = randomPhrase;

            // Rimuoviamo l'eventuale classe di animazione precedente
            generationContainer.classList.remove('fade-in', 'typing');

            // Forziamo il reflow per riavviare l'animazione
            void generationContainer.offsetWidth;

            // Aggiungiamo la classe di animazione "typing"
            generationContainer.classList.add('typing');
        })
        .catch(error => console.error('Errore nel caricare il JSON:', error));
}