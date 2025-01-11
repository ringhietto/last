document.addEventListener("DOMContentLoaded", () => {
  const dates = document.querySelectorAll(".date");
  const yearContainer = document.querySelector(".year-container");
  const yearCircle = document.querySelector(".year-circle");
  const circle = document.querySelector(".date-circle");
  const xOffset = -860;
  const yOffset = -690;
  let centerX, centerY;
  let currentIndex = 3;
  let lastEncoderValue = 0;

  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / dates.length;
    const radius = 1000;
    const activeFontSize = 2.5;
    const normalFontSize = 1;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    dates.forEach((date, index) => {
      const relativeIndex =
        (index - currentIndex + dates.length) % dates.length;
      const angle = angleStep * relativeIndex - 165;

      date.style.display = "block";

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
        relativeIndex === 0 || relativeIndex === dates.length - 1 ? 0 : 1;

      date.style.transform = `translate(${x}px, ${y}px)`;
      date.style.opacity = opacity;

      if (relativeIndex === 5) {
        date.classList.add("active");
        updateDate(date.textContent);
      } else {
        date.classList.remove("active");
      }
    });
  }

  function updateDate(date) {
    console.log("Data selezionata:", date);
  }

  function rotateDates(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + dates.length) % dates.length;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % dates.length;
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
    const message = event.data;
    if (message === "Start pressed!") {
      document.querySelector(".date-container").style.display = "none";
      yearContainer.style.display = "block";
      yearCircle.style.display = "block";
      yearContainer.classList.add("fade-in");
      yearCircle.classList.add("fade-in");
    } else {
      const encoderValue = parseInt(message.split(" ")[2]);
      if (!isNaN(encoderValue)) {
        if (encoderValue > lastEncoderValue) {
          rotateDates("right");
        } else if (encoderValue < lastEncoderValue) {
          rotateDates("left");
        }
        lastEncoderValue = encoderValue;
      }
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});
