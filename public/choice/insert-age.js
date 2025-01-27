document.addEventListener("DOMContentLoaded", function() {
    // Seleziona il body
    const body = document.querySelector('body');

    // Imposta l'opacità iniziale a 0
    gsap.set(body, { opacity: 0 });

    // Aggiungi un delay di 0.5 secondi prima di iniziare l'animazione
    setTimeout(() => {
        // Anima l'ingresso del body con una dissolvenza
        gsap.to(body, { opacity: 1, duration: 1, onComplete: holdElements });
    }, 250);

    function holdElements() {
        // Mantieni gli elementi visibili per 3 secondi
        setTimeout(() => {
            // Anima l'uscita del body con una dissolvenza
            gsap.to(body, { opacity: 0, duration: 1, onComplete: redirectToNextPage });
        }, 500);
    }

    function redirectToNextPage() {
        // Reindirizza alla pagina successiva solo quando la transizione è completata
        setTimeout(() => {
            window.location.href = "2b-age.html";
        }, 1000); // Assicurati che la durata della transizione sia rispettata
    }
});