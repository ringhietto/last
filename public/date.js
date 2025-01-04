// date.js

// Inizializza la comunicazione seriale
let serial; // Variabile per la comunicazione seriale

function setup() {
  // Configura la comunicazione seriale
  serial = new p5.SerialPort(); // Usa p5.js per la comunicazione seriale
  serial.list(); // Elenca le porte seriali disponibili
  serial.open("COM3"); // Sostituisci con la tua porta seriale

  // Aggiungi un listener per i dati in arrivo
  serial.on("data", handleSerialData);
}

function handleSerialData() {
  const data = serial.readLine(); // Leggi la linea di dati
  if (data) {
    const pressCount = parseInt(data); // Assicurati che il dato sia un numero
    // Puoi inviare pressCount a simulate.js o gestirlo qui
    console.log("Press count received: " + pressCount);
  }
}

// Assicurati di chiamare setup() all'avvio
setup();
