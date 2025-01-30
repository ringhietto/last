const socket = new WebSocket("ws://127.0.0.1:8001");
console.log("Websocket connected per creare la connessione");
socket.onmessage = (event) => {
  console.log(event.data);
  handleSerialData(event.data);
};

function handleSerialData(data) {
  if (data.includes("Short press detected!")) {
    console.log("Short press detected!");
    startVideo();
  }
}

function startVideo() {
  const videoElement = document.getElementById("accidentVideo");
  const thumbnail = document.getElementById("videoThumbnail");

  if (videoElement) {
    videoElement.style.display = "block";
    thumbnail.style.display = "none";
    videoElement
      .play()
      .then(() => {
        console.log("Video avviato con successo.");
      })
      .catch((error) => {
        console.error("Errore durante l'avvio del video:", error);
      });

    videoElement.addEventListener("ended", () => {
      thumbnail.style.display = "block";
      videoElement.style.display = "none";
    });
  }
}








// let pressStartTime; // Variabile per memorizzare il tempo di inizio della pressione
// let pressTimeout; // Variabile per gestire il timeout

// const socket = new WebSocket("ws://127.0.0.1:8001");
// console.log("Websocket connected per creare la connessione");

// socket.onmessage = (event) => {
//   console.log(event.data);
//   handleSerialData(event.data);
// };

// function handleSerialData(data) {
//   if (data.includes("Short press detected!")) {
//     console.log("Short press detected!");
//     startVideo();
//   } else if (data.includes("Start pressed!")) {
//     pressStartTime = Date.now(); // Inizia a registrare il tempo
//     console.log("Start pressed!");

//     // Imposta un timeout per verificare se è un doppio clic
//     pressTimeout = setTimeout(() => {
//       console.log("Durata della pressione:", Date.now() - pressStartTime, "ms");
//       // Passa a pagina4.html
//       window.location.href = "pagina4.html";
//     }, 1500); // 1500 ms per considerare un doppio clic
//   } else if (data.includes("Double press detected!")) {
//     clearTimeout(pressTimeout); // Cancella il timeout se viene rilevato un doppio clic
//     console.log("Double press detected!");
//     console.log("Durata della pressione:", Date.now() - pressStartTime, "ms");
//     // Passa a pagina4.html
//     window.location.href = "pagina4.html";
//   }
// }

// function startVideo() {
//   const videoElement = document.getElementById("accidentVideo");
//   const thumbnail = document.getElementById("videoThumbnail");

//   if (videoElement) {
//     videoElement.style.display = "block";
//     thumbnail.style.display = "none";
//     videoElement
//       .play()
//       .then(() => {
//         console.log("Video avviato con successo.");
//       })
//       .catch((error) => {
//         console.error("Errore durante l'avvio del video:", error);
//       });

//     videoElement.addEventListener("ended", () => {
//       thumbnail.style.display = "block";
//       videoElement.style.display = "none";
//     });
//   } else {
//     console.error("Elemento video non trovato.");
//   }
// }
