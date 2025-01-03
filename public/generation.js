function loadPhrases(deathType) {
    fetch(`consequence/${deathType}.json`)
        .then(response => response.json())
        .then(data => {
            const generationContainer = document.querySelector('.consequence h1');
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

function loadVip(vipType) {
    const vipPhrases = {
        'accident': 'Just like John Lennon',
        'murder': 'Just like Elvis Presley',
        'overdose': 'Just like Kurt Cobain',
        'suicide': 'Just like Robin Williams',
        'illness': 'Just like Steve Jobs'
    };

    const generationContainer = document.querySelector('.just-like h4');
    const phrase = vipPhrases[vipType.toLowerCase()];

    if (phrase) {
        // Rimuoviamo l'eventuale classe di animazione precedente
        generationContainer.classList.remove('fade-in');

        // Forziamo il reflow per riavviare l'animazione
        void generationContainer.offsetWidth;

        // Impostiamo il testo della frase dopo 3 secondi
        setTimeout(() => {
            generationContainer.textContent = phrase;

            // Aggiungiamo la classe di animazione "fade-in"
            generationContainer.classList.add('fade-in');
        }, 3000); // Ritardo di 3 secondi
    } else {
        console.error('Tipo di VIP non riconosciuto:', vipType);
    }
}

