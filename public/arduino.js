// async function readArduinoData(reader) {
//     try {
//         const { value, done } = await reader.read();
//         if (done) {
//             console.log('Connessione chiusa.');
//             return false;
//         }

//         const decodedValue = new TextDecoder().decode(value).trim();
//         console.log('Ricevuto:', decodedValue);

//         // Verifica se il messaggio contiene "Start_State"
//         if (decodedValue.startsWith("Start_State: ")) {
//             const state = parseInt(decodedValue.split(": ")[1]); // Estrae il valore
//             console.log("Start_State ricevuto:", state);

//             if (state === 1) {
//                 console.log("Navigazione verso pagina2.html.");
//                 window.location.href = "pagina2.html"; // Cambia pagina
//             }
//         }

//         return true;
//     } catch (error) {
//         console.error('Errore durante la lettura:', error);
//         return false;
//     }
// }

// async function connectArduino() {
//     try {
//         const port = await navigator.serial.requestPort(); // Richiede accesso alla porta
//         await port.open({ baudRate: 9600 }); // Imposta il baudrate

//         const reader = port.readable.getReader(); // Lettura dati dalla seriale
//         console.log('Connessione a Arduino riuscita.');

//         let isConnected = true;
//         while (isConnected) {
//             isConnected = await readArduinoData(reader); // Legge i dati dalla seriale
//         }

//         reader.releaseLock(); // Libera la porta quando hai finito
//     } catch (error) {
//         console.error('Errore nella connessione di Arduino:', error);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const backgroundDiv = document.getElementById('connectButton');

//     if (backgroundDiv) {
//         backgroundDiv.addEventListener('click', async () => {
//             try {
//                 const port = await navigator.serial.requestPort();
//                 await port.open({ baudRate: 9600 });

//                 const reader = port.readable.getReader();
//                 const writer = port.writable.getWriter();

//                 // Send a command to Arduino
//                 await writer.write(new TextEncoder().encode("Start_State: "));

//                 let buffer = '';

//                 // Read data from Arduino
//                 while (true) {
//                     const { value, done } = await reader.read();
//                     if (done) {
//                         break;
//                     }
//                     buffer += new TextDecoder().decode(value);

//                     // Check if the buffer contains a complete message
//                     let index;
//                     while ((index = buffer.indexOf('\n')) !== -1) {
//                         const message = buffer.slice(0, index).trim();
//                         buffer = buffer.slice(index + 1);
//                         console.log('Received:', message);

//                         // Check if the message contains "Start_State: 1"
//                         if (message.startsWith("Start_State: ")) {
//                             const state = parseInt(message.split(": ")[1]);
//                             if (state === 1) {
//                                 window.location.href = 'pagina2.html';
//                             }
//                         }

//                         // Check if the message contains "Val Analogico Manopola 1"
//                         if (message.startsWith("Val Analogico Manopola 1: ")) {
//                             const valSelezione = parseInt(message.split(": ")[1]);
//                             // Invia il valore alla pagina 3 tramite WebSocket
//                             const ws = new WebSocket('ws://localhost:3001');
//                             ws.onopen = () => {
//                                 ws.send(JSON.stringify({ type: 'valSelezione', value: valSelezione }));
//                             };
//                         }
//                     }
//                 }

//                 reader.releaseLock();
//                 writer.releaseLock();
//             } catch (error) {
//                 console.error('Error accessing the serial port:', error);
//                 alert('Error accessing the serial port: ' + error.message);
//             }
//         });
//     } else {
//         console.error('Element with id "connectButton" not found.');
//     }
// });

const socket = new WebSocket("ws://127.0.0.1:8001");
console.log("Websocket connected per creare la connessione");
socket.onmessage = (event) => {
  console.log(event.data);
};
