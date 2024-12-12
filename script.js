// Animazione dell'opacità
const backgroundImage = document.querySelector('.background');

function toggleOpacity() {
    backgroundImage.style.transition = 'opacity 1s'; // Impostiamo la transizione
    if (backgroundImage.style.opacity == 0.75) {
        backgroundImage.style.opacity = 1;
    } else {
        backgroundImage.style.opacity = 0.75;
    }
}

// Impostiamo l'animazione per ogni 5 secondi
setInterval(toggleOpacity, 5000);


// Funzione per aggiungere un effetto fade-out e navigare
function navigateWithAnimation(targetPage) {
    // Aggiungi la classe fade-out per fare l'animazione
    document.body.classList.add('fade-out');
    
    // Dopo 500ms (tempo della transizione), cambia la pagina
    setTimeout(() => {
        window.location.href = targetPage;
    }, 500); // Tempo dell'animazione
}

// Gestione della pressione dei tasti freccia
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
        if (window.location.pathname === '/index.html') {
            navigateWithAnimation('/pagina2.html');
        } else if (window.location.pathname === '/pagina2.html') {
            navigateWithAnimation('/pagina3.html');
        }
    } else if (e.key === 'ArrowUp') {
        if (window.location.pathname === '/pagina2.html') {
            navigateWithAnimation('/index.html');
        } else if (window.location.pathname === '/pagina3.html') {
            navigateWithAnimation('/pagina2.html');
        }
    }
});









// Riferimenti agli elementi
const words = document.querySelectorAll('.word');
const radius = 300; // Raggio della semicirconferenza
const centerX = 70; // Sposta il centro più a sinistra
const centerY = 450; // Sposta il centro più in alto
let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente

// Funzione per calcolare e posizionare le parole
function updatePositions() {
    const angleStep = 180 / (words.length - 1); // Calcola l'angolo tra ogni parola

    words.forEach((word, index) => {
        // Calcolo dell'indice relativo per il posizionamento ciclico delle parole
        const relativeIndex = (index - currentIndex + words.length) % words.length; // Indice ciclico per il corretto posizionamento
        const angle = angleStep * relativeIndex - 90; // Angolo rispetto al centro (da -90° a +90°)

        const x = centerX + radius * Math.cos((angle * Math.PI) / 220);
        const y = centerY + radius * Math.sin((angle * Math.PI) / 220);

        // Configura la scala e l'opacità
        const scale = relativeIndex === 0 ? 1.4 : 1; // La parola centrale (relativeIndex === 0) è più grande
        const opacity = relativeIndex === 0 ? 1 : 0.5; // La parola centrale è pienamente visibile

        // Applicazione delle trasformazioni
        word.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        word.style.opacity = opacity;

        // Aggiungi o rimuovi la classe "active" per la parola centrale
        if (relativeIndex === 0) {
            word.classList.add('active');
        } else {
            word.classList.remove('active');
        }
    });
}

// Funzione per scorrere le parole
function scrollWords(direction) {
    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % words.length; // Scorre avanti
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + words.length) % words.length; // Scorre indietro
    }
    updatePositions(); // Aggiorna la posizione delle parole
}

// Ascolta i tasti W e E per scorrere
document.addEventListener('keydown', (e) => {
    if (e.key === 'w') {
        scrollWords('prev');
    } else if (e.key === 'e') {
        scrollWords('next');
    }
});

// Inizializza la posizione iniziale
updatePositions();
