// Seleziona gli elementi
const videoContainer = document.getElementById('videoContainer');
const otherElements = document.querySelectorAll('.other-element, .circle, .consequences'); // Gli altri elementi da nascondere
let isVideoPlaying = false; // Variabile per tracciare se il video è in esecuzione

// Funzione per avviare il video e nascondere altri contenuti
function playVideoAndHideOthers(videoSrc) {
    // Controlla se un video è già in esecuzione
    if (isVideoPlaying) return; // Non fare nulla se il video è già in esecuzione

    isVideoPlaying = true; // Imposta che il video è in esecuzione

    // Nascondi gli altri elementi
    otherElements.forEach(element => {
        element.style.display = 'none';
    });

    // Mostra il contenitore del video
    videoContainer.style.display = 'block';

    // Imposta il video da riprodurre
    videoContainer.innerHTML = `<video id="videoPlayer" autoplay muted>
                                    <source src="${videoSrc}" type="video/mp4">
                                    Il tuo browser non supporta il tag video.
                                 </video>`;

    const video = document.getElementById('videoPlayer');
    
    // Applica lo stesso stile CSS al video
    video.style.width = '100vw';  // Larghezza 100% della viewport
    video.style.height = '100vh'; // Altezza 100% della viewport
    video.style.objectFit = 'cover'; // Ritaglia il video per riempire l'area

    // Quando il video finisce, ripristina la pagina
    video.addEventListener('ended', () => {
        // Nascondi il video
        videoContainer.style.display = 'none';

        // Mostra di nuovo gli altri elementi
        otherElements.forEach(element => {
            element.style.display = 'block';
        });

        // Rimuovi eventuali modifiche al contesto della pagina (es. selezione)
        // Puoi anche conservare lo stato dell'elemento selezionato, se necessario
        isVideoPlaying = false; // Imposta che il video non è più in esecuzione
    });
}

// Esegui la funzione con il video scelto
socket.onmessage = (event) => {
    if (event.data.includes("Video pressed!")) {
        const activeWord = document.querySelector('.word.active').textContent;
        let videoSrc = '';

        // Seleziona il video in base alla parola attiva
        switch(activeWord) {
            case 'MURDER':
                videoSrc = '/public/asset/videos/murder.mp4';
                break;
            case 'ILLNESS':
                videoSrc = '/public/asset/videos/illness.mp4';
                break;
            case 'OVERDOSE':
                videoSrc = '/public/asset/videos/overdose.mp4';
                break;
            case 'SUICIDE':
                videoSrc = '/public/asset/videos/suicide.mp4';
                break;
            case 'ACCIDENT':
                videoSrc = '/public/asset/videos/accident.mp4';
                break;
        }

        // Esegui la funzione
        playVideoAndHideOthers(videoSrc);
    }
};
