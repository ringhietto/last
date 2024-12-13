let serialPort;
let reader;
const words = document.querySelectorAll('.word');
const radius = 300; // Raggio della semicirconferenza
const centerX = 70; // Sposta il centro più a sinistra
const centerY = 450; // Sposta il centro più in alto
let currentIndex = 2; // La terza parola ("Overdose") è al centro inizialmente

document.getElementById('connectButton').addEventListener('click', connectArduino);

async function connectArduino() {
    try {
        // Richiede l'accesso alla porta seriale
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 9600 });

        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        console.log('Connesso ad Arduino!');
        readArduinoData();
    } catch (error) {
        console.error('Errore nella connessione:', error);
    }
}

async function readArduinoData() {
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log('Connessione chiusa.');
                break;
            }

            // Interpreta i dati ricevuti da Arduino
            const potValue = parseInt(value.trim()); // Supponiamo che il potenziometro "Val_Selezione" sia il valore ricevuto
            console.log(`Val_Selezione: ${potValue}`);

            // Verifica che il valore sia compreso tra 1 e 5
            if (potValue >= 1 && potValue <= 5) {
                // Aggiorna i tipi di morte in base al valore del potenziometro
                updateDeathTypes(potValue);
            } else {
                console.error('Valore del potenziometro fuori intervallo:', potValue);
            }
        }
    } catch (error) {
        console.error('Errore durante la lettura:', error);
    }
}

// Funzione per aggiornare i tipi di morte
function updateDeathTypes(selection) {
    console.log('Aggiornamento tipi di morte con selezione:', selection);
    currentIndex = selection - 1; // Aggiorna l'indice corrente in base alla selezione
    updatePositions(); // Aggiorna la posizione delle parole
}

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

// Inizializza la posizione iniziale
updatePositions();