document.addEventListener('DOMContentLoaded', function() {
    const words = document.querySelectorAll('.word');  // Seleziona tutte le parole nella word-container
    const generationDiv = document.querySelector('.generation h4'); // Il div dove verrà mostrata la frase
    const phrases = {
        "MURDER": "generation/murder.json",
        "ILLNESS": "generation/illness.json",
        "OVERDOSE": "generation/overdose.json",
        "SUICIDE": "generation/suicide.json",
        "ACCIDENT": "generation/accident.json"
    };

    // Funzione per caricare un file JSON e mostrare una frase casuale
    function loadRandomPhrase(file) {
        fetch(file)
            .then(response => response.json())
            .then(data => {
                const randomIndex = Math.floor(Math.random() * data.phrases.length);
                generationDiv.textContent = data.phrases[randomIndex];  // Mostra la frase
            })
            .catch(error => console.error("Error loading JSON:", error));
    }

    // Aggiungi un event listener a ciascuna parola per cambiare la frase
    words.forEach(word => {
        word.addEventListener('click', function() {
            const selectedWord = word.textContent.trim().toUpperCase();  // Ottieni la parola selezionata
            if (phrases[selectedWord]) {
                loadRandomPhrase(phrases[selectedWord]);  // Carica la frase dalla parola selezionata
            }
        });
    });
});
