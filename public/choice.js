document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const circle = document.querySelector('.circle');
    const radius = 450; // Raggio della semicirconferenza ridotto
    const xOffset = -530; // Offset orizzontale per spostare le parole a destra o a sinistra
    const yOffset = -480; // Offset verticale per spostare le parole su o giù
    let centerX, centerY;
    let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente
    let encoderCounter = 0; // Contatore per il debouncing
    const debounceThreshold = 5; // Soglia per il debouncing

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
            // Calcolo dell'indice relativo per il posizionamento ciclico delle parole
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
            } else {
                word.classList.remove('active');
                word.style.fontSize = '1em'; // Dimensione normale per le altre parole
            }
        });
    }

    // Funzione per ruotare le parole
    function rotateWords(direction) {
        if (direction === 'left') {
            currentIndex = (currentIndex + 1) % words.length;
        } else if (direction === 'right') {
            currentIndex = (currentIndex - 1 + words.length) % words.length;
        }
        updatePositions();
    }

    // Inizializza le posizioni delle parole
    updateCenter();
    window.addEventListener('resize', updateCenter);

    // WebSocket per ricevere i dati dell'encoder
    const socket = new WebSocket("ws://127.0.0.1:8001");

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log(event.data);
        const encoderValue = parseInt(event.data.split(' ')[2]); // Estrai il valore dell'encoder
        if (!isNaN(encoderValue)) {
            // Aggiungi o sottrai al contatore dell'encoder
            encoderCounter += encoderValue - currentIndex; 
            if (Math.abs(encoderCounter) >= debounceThreshold) {
                if (encoderCounter > 0) {
                    rotateWords('left');
                } else if (encoderCounter < 0) {
                    rotateWords('right');
                }
                encoderCounter = 0; // Resetta il contatore dopo l'aggiornamento
            }
            currentIndex = encoderValue % words.length; // Aggiorna l'indice corrente
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };
});
