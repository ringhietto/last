document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const circle = document.querySelector('.circle');
    const radius = 450;
    const xOffset = -530;
    const yOffset = -480;
    let centerX, centerY;
    let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente
    let encoderCounter = 0;
    const debounceThreshold = 5;

    // Funzione per aggiornare il centro della semicirconferenza
    function updateCenter() {
        const circleRect = circle.getBoundingClientRect();
        centerX = circleRect.left + circleRect.width / 2;
        centerY = circleRect.top + circleRect.height / 2;
        updatePositions(); // Aggiorna le posizioni delle parole
    }

    // Funzione per calcolare e posizionare le parole
    function updatePositions() {
        const angleStep = 180 / (words.length - 1); // Calcola l'angolo tra ogni parola

        words.forEach((word, index) => {
            const relativeIndex = (index - currentIndex + words.length) % words.length; // Indice ciclico per il corretto posizionamento
            const angle = angleStep * relativeIndex - 90; // Angolo rispetto al centro (da -90° a +90°)

            const x = centerX + radius * Math.cos((angle * Math.PI) / 180) + xOffset;
            const y = centerY + radius * Math.sin((angle * Math.PI) / 180) + yOffset;

            // Configura l'opacità
            const opacity = relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1; // Le parole più esterne sono nascoste

            // Applicazione delle trasformazioni
            word.style.transform = `translate(${x}px, ${y}px)`;
            word.style.opacity = opacity;

            // Aggiungi o rimuovi la classe 'active' per la parola centrale
            if (relativeIndex === 2) {
                word.classList.add('active');
                word.style.fontSize = '2em'; // Mantieni la parola centrale grande
                loadPhrases(word.textContent.toLowerCase()); // Carica il JSON basato sulla parola centrale
            } else {
                word.classList.remove('active');
                word.style.fontSize = '1em'; // Dimensione normale per le altre parole
            }
        });
    }

    // Funzione per ruotare le parole in base alla direzione
    function rotateWords(direction) {
        if (direction === 'left') {
            currentIndex = (currentIndex + 1) % words.length; // Spostamento in avanti (a sinistra)
        } else if (direction === 'right') {
            currentIndex = (currentIndex - 1 + words.length) % words.length; // Spostamento all'indietro (a destra)
        }
        updatePositions();
    }

    // Funzione per caricare il JSON in base alla parola centrale
    function loadPhrases(deathType) {
        fetch(`generation/${deathType}.json`)
            .then(response => response.json())
            .then(data => {
                const generationContainer = document.querySelector('.generation h4');
                const randomPhrase = data.phrases[Math.floor(Math.random() * data.phrases.length)];
                generationContainer.textContent = randomPhrase;
            })
            .catch(error => console.error('Errore nel caricare il JSON:', error));
    }

    // Aggiungi qui il codice per rilevare la direzione del movimento e chiamare rotateWords()
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            rotateWords('left');
        } else if (event.key === 'ArrowRight') {
            rotateWords('right');
        }
    });

    // WebSocket per rilevare la direzione di rotazione tramite encoder
    const socket = new WebSocket("ws://127.0.0.1:8001");

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log(event.data);
        const encoderValue = parseInt(event.data.split(' ')[2]); // Estrai il valore dell'encoder
        if (!isNaN(encoderValue)) {
            encoderCounter += encoderValue; // Modifica direttamente l'encoderCounter

            if (Math.abs(encoderCounter) >= debounceThreshold) {
                if (encoderCounter > 0) {
                    rotateWords('left'); // Movimento a sinistra
                } else if (encoderCounter < 0) {
                    rotateWords('right'); // Movimento a destra
                }
                encoderCounter = 0; // Resetta il contatore dopo l'aggiornamento
            }
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    // Inizializza la posizione delle parole
    updateCenter();
    window.addEventListener('resize', updateCenter);
});
