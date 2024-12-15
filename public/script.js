
const words = document.querySelectorAll('.word');
const circle = document.querySelector('.circle');
const radius = 400; // Raggio della semicirconferenza ridotto
const xOffset = 50; // Offset orizzontale per spostare le parole a destra (valore positivo) o a sinistra (valore negativo)
let centerX, centerY;
let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente



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
        const y = centerY + radius * Math.sin((angle * Math.PI) / 180);

        // Configura l'opacità
        const opacity = relativeIndex === 0 || relativeIndex === words.length - 1 ? 0 : 1; // Le parole più esterne sono nascoste

        // Applicazione delle trasformazioni
        word.style.transform = `translate(${x}px, ${y}px)`;
        word.style.opacity = opacity;

        // Aggiungi o rimuovi la classe "active" per la parola centrale
        if (relativeIndex === 2) {
            word.classList.add('active');
        } else {
            word.classList.remove('active');
        }
    });
}

// Inizializza la posizione iniziale
updateCenter();