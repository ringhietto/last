const express = require('express');
const path = require('path');
const { SerialPort } = require('serialport');
const WebSocket = require('ws');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inizializza WebSocket per la comunicazione tra browser e server
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

const wss = new WebSocket.Server({ server });

// Configura la porta seriale
const serial = new SerialPort({
    path: '/dev/tty.usbmodem101', // Aggiorna il percorso con il corretto
    baudRate: 9600,
});

serial.on('open', () => {
    console.log('Connessione seriale aperta.');
});

serial.on('data', (data) => {
    console.log('Dati ricevuti da Arduino:', data.toString());
    // Invia i dati al client tramite WebSocket
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data.toString());
        }
    });
});