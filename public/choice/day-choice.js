document.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day");
  const circle = document.querySelector(".day-circle");
  const xOffset = -860;
  const yOffset = -682;
  let centerX, centerY;
  let currentIndex = 7;
  let lastEncoderValue = 0;

  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / days.length;
    const radius = 1000;
    const activeFontSize = 2.5;
    const normalFontSize = 1;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    days.forEach((day, index) => {
      const relativeIndex = (index - currentIndex + days.length) % days.length;
      const angle = angleStep * relativeIndex - 148.3;

      const distance = relativeIndex === 5 ? distanceActive : distanceNormal;

      const x =
        centerX +
        (radius + distance) * Math.cos((angle * Math.PI) / 180) +
        xOffset;
      const y =
        centerY +
        (radius + distance) * Math.sin((angle * Math.PI) / 180) +
        yOffset;

      const opacity =
        relativeIndex === 0 || relativeIndex === days.length - 1 ? 0 : 1;

      day.style.transform = `translate(${x}px, ${y}px)`;
      day.style.opacity = opacity;

      if (relativeIndex === 5) {
        day.classList.add("active");
        updateDay(day.textContent);
      } else {
        day.classList.remove("active");
      }
    });
  }

  function updateDay(day) {
    console.log("Data selezionata:", day);
  }

  function rotateDays(direction) {
    if (direction === "left") {
      // Rimuovi i limiti per la rotazione a sinistra
      // if (currentIndex === 13) return; // Stop at date13
      // if (currentIndex === 14 && lastEncoderValue < 14) return; // Stop at date14 when coming from lower numbers
      currentIndex = (currentIndex - 1 + days.length) % days.length;
    } else if (direction === "right") {
      // Rimuovi i limiti per la rotazione a destra
      // if (currentIndex === 19) return; // Stop at date18
      // if (currentIndex === 20 && lastEncoderValue > 20) return; // Stop at date19 when coming from higher numbers
      currentIndex = (currentIndex + 1) % days.length;
    }
    updatePositions();
  }

  updateCenter();
  window.addEventListener("resize", updateCenter);

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const encoderValue = parseInt(event.data.split(" ")[2]);
    if (!isNaN(encoderValue)) {
      if (encoderValue > lastEncoderValue) {
        rotateDays("right");
      } else if (encoderValue < lastEncoderValue) {
        rotateDays("left");
      }
      lastEncoderValue = encoderValue;
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
