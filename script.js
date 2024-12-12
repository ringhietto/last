// Funzione per aggiungere un effetto fade-out e navigare
function navigateWithAnimation(targetPage) {
    // Aggiungi la classe fade-out per fare l'animazione
    document.body.classList.add('fade-out');
    
    // Dopo 500ms (tempo della transizione), cambia la pagina
    setTimeout(() => {
        window.location.href = targetPage;
    }, 500); // Tempo dell'animazione
}

// Aggiungi un listener per i tasti freccia
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        // Cambia pagina alla successiva con animazione
        navigateToNextPage();
    } else if (event.key === 'ArrowUp') {
        // Cambia pagina alla precedente con animazione
        navigateToPreviousPage();
    }
});

// Funzione per navigare alla pagina successiva
function navigateToNextPage() {
    // Applica l'animazione di uscita
    document.body.classList.add('fade-out');
    
    // Dopo 1 secondo (durata dell'animazione), cambia pagina
    setTimeout(() => {
        const currentPage = window.location.pathname;
        let nextPage = '';
        
        if (currentPage === '/index.html') {
            nextPage = 'pagina2.html';
        } else if (currentPage === '/pagina2.html') {
            nextPage = 'pagina3.html';
        } else if (currentPage === '/pagina3.html') {
            nextPage = 'index.html'; // Torna alla prima pagina
        }
        
        window.location.href = nextPage;
    }, 1000); // 1000ms = durata dell'animazione
}

// Funzione per navigare alla pagina precedente
function navigateToPreviousPage() {
    // Applica l'animazione di uscita
    document.body.classList.add('fade-out');
    
    // Dopo 1 secondo (durata dell'animazione), cambia pagina
    setTimeout(() => {
        const currentPage = window.location.pathname;
        let previousPage = '';
        
        if (currentPage === '/index.html') {
            previousPage = 'pagina3.html'; // Torna all'ultima pagina
        } else if (currentPage === '/pagina2.html') {
            previousPage = 'index.html';
        } else if (currentPage === '/pagina3.html') {
            previousPage = 'pagina2.html';
        }
        
        window.location.href = previousPage;
    }, 1000); // 1000ms = durata dell'animazione
}








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
