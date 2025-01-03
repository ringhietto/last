document.addEventListener('DOMContentLoaded', () => {
    const words = document.querySelectorAll('.word');
    const circle = document.querySelector('.circle');
    const radius = 400; // Raggio della semicirconferenza ridotto
    const xOffset = -630; // Offset orizzontale per centrare le parole
    const yOffset = -1450; // Offset verticale per posizionare le parole sopra il cerchio
    let centerX, centerY;
    let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente
    let lastEncoderValue = 0; // Valore dell'encoder precedente

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
            const angle = angleStep * relativeIndex - 180; // Angolo per rotazione orizzontale

            const x = centerX + radius * Math.cos((angle * Math.PI) / 180) + xOffset;
            const y = centerY + radius * Math.sin((angle * Math.PI) / 180) + yOffset;

            const opacity = relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1;

            word.style.transform = `translate(${x}px, ${y}px)`;
            word.style.opacity = opacity;

            if (relativeIndex === 2) {
                word.classList.add('active');
                word.style.fontSize = '3em';
                loadVip(word.textContent.toLowerCase()); // Chiama la funzione loadVip
                loadPhrases(word.textContent.toLowerCase()); // Chiama la funzione loadPhrases
            } else {
                word.classList.remove('active');
                word.style.fontSize = '2em';
            }
        });
    }

    function rotateWords(direction) {
        if (direction === 'left') {
            currentIndex = (currentIndex - 1 + words.length) % words.length;
        } else if (direction === 'right') {
            currentIndex = (currentIndex + 1) % words.length;
        }
        updatePositions();
    }

    // Inizializza la posizione iniziale
    updateCenter();

    document.addEventListener('DOMContentLoaded', () => {
        updateCenter(); // Assicurati che la posizione venga aggiornata dopo il caricamento
        window.addEventListener('resize', updateCenter); // Riposiziona le parole al ridimensionamento della finestra
    });

    const socket = new WebSocket("ws://127.0.0.1:8001");

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log(event.data);
        const encoderValue = parseInt(event.data.split(' ')[2]);
        if (!isNaN(encoderValue)) {
            if (encoderValue > 0) {
                rotateWords('right');
            } else if (encoderValue < 0) {
                rotateWords('left');
            }
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    gsap.to(circle, {
        rotation: "+=360", // Incrementa la rotazione continuamente
        duration: 20,
        repeat: -1,
        ease: "linear"
    });
});