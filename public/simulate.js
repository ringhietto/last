// simulate.js

let port; // Variabile per la porta seriale
let reader; // Variabile per il lettore

// Funzione per avviare il video
function startVideo() {
  console.log("Video started!");
  // Aggiungi qui il codice per avviare il video
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

document
  .getElementById("videoContainer")
  .addEventListener("click", function () {
    var video = document.getElementById("accidentVideo");
    var thumbnail = document.getElementById("videoThumbnail");
    if (video.style.display === "none") {
      thumbnail.style.display = "none"; // Nascondi l'immagine
      video.style.display = "block"; // Mostra il video
      video.play(); // Avvia il video
    }
  });

document.getElementById("accidentVideo").addEventListener("ended", function () {
  var thumbnail = document.getElementById("videoThumbnail");
  this.style.display = "none"; // Nascondi il video
  thumbnail.style.display = "block"; // Mostra l'immagine
});

