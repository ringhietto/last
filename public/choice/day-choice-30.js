document.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day");
  const dayCircle = document.querySelector(".day-circle");
  const xOffset = -960;
  const yOffset = -888;
  let centerX, centerY;
  let currentIndex = 7;
  let lastEncoderValue = 10000;
  let stopEncoder = false;

  function updateCenter() {
    const circleRect = dayCircle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / days.length;
    const radius = 1000;
    const activeFontSize = 2.5;
    const normalFontSize = 1.04;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    days.forEach((day, index) => {
      const relativeIndex = (index - currentIndex + days.length) % days.length;
      const angle = angleStep * relativeIndex - 150.25;

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
    localStorage.setItem("selectedDay", day);
  }

  function rotateDays(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + days.length) % days.length;
    } else if (direction === "right") {
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
    const message = event.data;
    const selectedMonth = localStorage.getItem("selectedMonth");

    if (message === "Short press detected!") {
      if (selectedMonth === "JANUARY") {
        window.location.href = "6-year-january.html";
        stopEncoder = true;
      } else {
        window.location.href = "6-year.html";
        stopEncoder = true;
      }
    } else if (message === "Double press detected!") {
      window.location.href = "4-month.html";
    } else if (stopEncoder === false) {
      const encoderValue = parseInt(message.split(" ")[2]);
      if (!isNaN(encoderValue)) {
        if (encoderValue > lastEncoderValue) {
          rotateDays("right");
        } else if (encoderValue < lastEncoderValue) {
          rotateDays("left");
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
