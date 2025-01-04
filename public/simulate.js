// simulate.js

// Funzione per avviare il video
function startVideo() {
  console.log("Video started!");
  // Aggiungi qui il codice per avviare il video
  // Ad esempio, se stai usando un elemento video HTML:
  // document.getElementById('myVideo').play();
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
function listenForSerialData() {
  // Supponendo che tu stia usando una libreria per la comunicazione seriale
  const serial = new p5.SerialPort(); // Usa p5.js per la comunicazione seriale
  serial.list(); // Elenca le porte seriali disponibili
  serial.open("COM3"); // Sostituisci con la tua porta seriale

  // Aggiungi un listener per i dati in arrivo
  serial.on("data", function () {
    const data = serial.readLine(); // Leggi la linea di dati
    if (data) {
      const pressCount = parseInt(data); // Assicurati che il dato sia un numero
      handleStartPress(pressCount); // Gestisci la pressione
    }
  });
}

// Inizializza la comunicazione seriale
listenForSerialData();
