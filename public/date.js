// Gestione dei tempi per il doppio click
let pressStartTime = 0;
let lastPressTime = 0;
let lastPressDuration = 0;

// Intervalli di tempo per le pressioni
const firstPressMin = 1; // 1ms
const firstPressMax = 40; // 40ms
const secondPressMin = 40; // 40ms
const secondPressMax = 80; // 80ms

socket.onmessage = (event) => {
  if (event.data === "Start pressed!") {
    const currentTime = new Date().getTime();

    if (pressStartTime === 0) {
      pressStartTime = currentTime;
    } else {
      const pressDuration = currentTime - pressStartTime;
      console.log(`Doppio click: ${pressDuration}ms`); // Solo questo log

      if (!lastPressTime) {
        if (pressDuration >= firstPressMin && pressDuration <= firstPressMax) {
          lastPressTime = currentTime;
          lastPressDuration = pressDuration;
        }
      } else {
        if (
          pressDuration >= secondPressMin &&
          pressDuration <= secondPressMax
        ) {
          window.location.href = "pagina4.html";
        }

        // Reset completo dopo il tentativo di doppio click
        setTimeout(() => {
          lastPressTime = 0;
          lastPressDuration = 0;
          pressStartTime = 0;
        }, 1000); // Reset dopo 1 secondo
      }

      pressStartTime = 0;
    }
  }
};
