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
            } else {
                word.classList.remove('active');
                word.style.fontSize = '1em';
            }
        });
    }

    function rotateWords(direction) {
        if (direction === 'left') {
            currentIndex = (currentIndex + 1) % words.length;
        } else if (direction === 'right') {
            currentIndex = (currentIndex - 1 + words.length) % words.length;
        }
        updatePositions();
    }

    updateCenter();
    window.addEventListener('resize', updateCenter);

    const socket = new WebSocket("ws://127.0.0.1:8001");

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log(event.data);
        const encoderValue = parseInt(event.data.split(' ')[2]);
        if (!isNaN(encoderValue)) {
            if (encoderValue > 0) {
                encoderCounter++;
            } else {
                encoderCounter--;
            }

            if (Math.abs(encoderCounter) >= debounceThreshold) {
                if (encoderCounter > 0) {
                    rotateWords('left');
                } else if (encoderCounter < 0) {
                    rotateWords('right');
                }
                encoderCounter = 0;
            }
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket connection closed');
    };
});