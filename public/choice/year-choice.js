document.addEventListener("DOMContentLoaded", () => {
  const years = document.querySelectorAll(".year");
  const circle = document.querySelector(".year-circle");
  const xOffset = -860;
  const yOffset = -720;
  let centerX, centerY;
  let currentIndex = 14;
  let lastEncoderValue = 0;

  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / years.length;
    const radius = 1000;
    const activeFontSize = 2.5;
    const normalFontSize = 1.04;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    years.forEach((year, index) => {
      const relativeIndex =
        (index - currentIndex + years.length) % years.length;
      const angle = angleStep * relativeIndex - 180;

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
        relativeIndex === 0 || relativeIndex === years.length - 1 ? 0 : 1;

      year.style.transform = `translate(${x}px, ${y}px)`;
      year.style.opacity = opacity;

      if (relativeIndex === 5) {
        year.classList.add("active");
        year.classList.remove("font-regular");
        year.classList.add("font-DemiBold");
        updateYear(year.textContent);
      } else {
        year.classList.remove("active");
        year.classList.add("font-regular");
        year.classList.remove("font-DemiBold");
      }
    });
  }

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Dati ricevuti dal WebSocket:", event.data);
    const message = event.data;
    console.log("Messaggio ricevuto:", message);
    if (message === "Start pressed!") {
      window.location.href = "6-year.html";
    } else {
      const encoderValue = parseInt(message.split(" ")[2]);
      if (!isNaN(encoderValue)) {
        if (encoderValue > lastEncoderValue) {
          rotateYears("right");
        } else if (encoderValue < lastEncoderValue) {
          rotateYears("left");
        }
        lastEncoderValue = encoderValue;
      }
    }
  };

  function updateYear(year) {
    console.log("Data selezionata:", year);
  }

  function rotateYears(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + years.length) % years.length;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % years.length;
    }
    updatePositions();
  }

  updateCenter();
  window.addEventListener("resize", updateCenter);

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
