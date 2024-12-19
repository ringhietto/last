// Mappatura delle parole ai tipi di morte
const deathTypes = {
    'overdose': 'overdose',
    'accident': 'accident',
    'suicide': 'suicide',
    'illness': 'illness',
    'murder': 'murder'
};






function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
}

function updatePositions() {
    const angleStep = 180 / (words.length - 1);

    words.forEach((word, index) => {
        const relativeIndex = (index - currentIndex + words.length) % words.length;
        const angle = angleStep * relativeIndex - 90;

        const x = centerX + radius * Math.cos((angle * Math.PI) / 180) + xOffset;
        const y = centerY + radius * Math.sin((angle * Math.PI) / 180) + yOffset;

        const opacity = relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1;

        word.style.transform = `translate(${x}px, ${y}px)`;
        word.style.opacity = opacity;

        if (relativeIndex === 2) {
            word.classList.add('active');
            word.style.fontSize = '2em';
            loadPhrases(deathTypes[word.textContent.toLowerCase()]);
        } else {
            word.classList.remove('active');
            word.style.fontSize = '1em';
        }
    });
}

function loadPhrases(deathType) {
    fetch(`generation/${deathType}.json`)
        .then(response => response.json())
        .then(data => {
            const generationContainer = document.querySelector('.generation h4');
            const randomPhrase = data.phrases[Math.floor(Math.random() * data.phrases.length)];

            // Impostiamo il testo della frase
            generationContainer.textContent = randomPhrase;

            // Rimuoviamo l'eventuale classe di animazione precedente
            generationContainer.classList.remove('fade-in', 'typing');

            // Aggiungiamo la classe di animazione "fade-in"
            generationContainer.classList.add('typing');

            // Se usi "typing", puoi sostituire "fade-in" con "typing"
            // generationContainer.classList.add('typing');
        })
        .catch(error => console.error('Errore nel caricare il JSON:', error));
}


function rotateWords(direction) {
    if (direction === 'left') {
        currentIndex = (currentIndex + 1) % words.length;
    } else if (direction === 'right') {
        currentIndex = (currentIndex - 1 + words.length) % words.length;
    }
    updatePositions();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCenter();
    window.addEventListener('resize', updateCenter);
});

