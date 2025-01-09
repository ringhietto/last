let port; // Variabile per la porta seriale
let reader; // Variabile per il lettore
let lastEncoderValue = 0; // Definisci lastEncoderValue

// Funzione per avviare il video
function startVideo() {
  console.log("Avvio del video...");
  const videoElement = document.getElementById("accidentVideo");
  const thumbnail = document.getElementById("videoThumbnail"); // Riferimento all'immagine di anteprima

  // Controlla se l'elemento video esiste
  if (videoElement) {
    videoElement.style.display = "block"; // Assicurati che il video sia visibile
    thumbnail.style.display = "none"; // Nascondi l'immagine di anteprima
    videoElement
      .play()
      .then(() => {
        console.log("Video avviato con successo.");
      })
      .catch((error) => {
        console.error("Errore durante l'avvio del video:", error);
      });

    // Aggiungi un listener per l'evento 'ended'
    videoElement.addEventListener("ended", () => {
      thumbnail.style.display = "block"; // Mostra di nuovo l'immagine di anteprima
      videoElement.style.display = "none"; // Nascondi il video
    });
  } else {
    console.error("Elemento video non trovato.");
  }
}

// Funzione per gestire il pulsante Start
function handleStartPress(pressCount) {
  if (pressCount === 1) {
    // Short press: avvia il video
    startVideo();
  } else if (pressCount === 2) {
    // Double press: ricarica la pagina
    window.location.href = "pagina3.html"; // Ricarica la pagina
  }
}

// Funzione per ascoltare i dati dal monitor seriale
async function listenForSerialData() {
  try {
    port = await navigator.serial.requestPort(); // Richiede accesso alla porta
    await port.open({ baudRate: 9600 }); // Imposta il baudrate

    reader = port.readable.getReader(); // Lettura dati dalla seriale
    console.log("Connessione alla porta seriale riuscita.");

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        console.log("Connessione chiusa.");
        break;
      }

      const decodedValue = new TextDecoder().decode(value).trim();
      console.log("Ricevuto:", decodedValue);

      // Gestisci il conteggio delle pressioni
      if (decodedValue.includes("Double press detected!")) {
        handleStartPress(2); // Gestisci il doppio clic
      } else if (decodedValue.includes("Short press detected!")) {
        handleStartPress(1); // Gestisci il clic singolo
      }
    }
  } catch (error) {
    console.error("Errore durante la comunicazione seriale:", error);
  }
}

// Funzione per mostrare l'immagine e il video corrispondenti
function showMediaForWord(word) {
  const videoContainer = document.querySelector(".video");
  const thumbnail = document.getElementById("videoThumbnail");

  // Nascondi tutti i video e le immagini
  videoContainer.style.display = "none"; // Nascondi il contenitore video
  thumbnail.style.display = "none"; // Nascondi l'immagine di anteprima

  // Mostra l'immagine di anteprima corrispondente
  thumbnail.src = `asset/stopvideo/${word}.png`; // Imposta il percorso dell'immagine
  thumbnail.style.display = "block"; // Mostra l'immagine di anteprima

  // Mostra il video corrispondente
  const videoElement = document.getElementById("accidentVideo"); // Assicurati che gli ID siano corretti
  if (videoElement) {
    videoElement.querySelector("source").src = `asset/videos/${word}.mp4`;
    videoElement.load(); // Ricarica il video per applicare la nuova sorgente
    videoContainer.style.display = "block"; // Mostra il contenitore video
    videoElement.style.display = "block"; // Mostra il video
  }
}

// Aggiungi un evento di clic al contenitore video
const videoContainer = document.getElementById("videoContainer");
videoContainer.addEventListener("click", startVideo); // Avvia il video al clic
