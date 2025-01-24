document.addEventListener("DOMContentLoaded", () => {
  // Rendi visibile il corpo della pagina dopo 1 secondo
  setTimeout(() => {
    document.body.classList.add("visible");
  }, 1000);

  const years = document.querySelectorAll(".age");
  const circle = document.querySelector(".age-circle");
  const xOffset = -960;
  const yOffset = -950;
  let centerX, centerY;
  let currentIndex = 30;
  let lastEncoderValue = 0;

  const yearsName = document.querySelector(".years-name");
  const ageChoice = document.querySelector(".age-choice");

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
    const normalFontSize = 1;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    years.forEach((year, index) => {
      const relativeIndex =
        (index - currentIndex + years.length) % years.length;
      const angle = angleStep * relativeIndex - 112;

      const distance = relativeIndex === 5 ? distanceActive : distanceNormal;

      const x =
        centerX +
        (radius + distance) * Math.cos((angle * Math.PI) / 180) +
        xOffset;
      const y =
        centerY +
        (radius + distance) * Math.sin((angle * Math.PI) / 180) +
        yOffset;

      year.style.transform = `translate(${x}px, ${y}px)`;
      year.style.opacity = 1; // Imposta sempre l'opacità a 1

      if (relativeIndex === 5) {
        year.classList.add("active");
        year.classList.remove("font-regular");
        year.classList.add("font-DemiBold");
        gsap.to(year, { fontSize: "2.5em", duration: 0.5 });
        updateYear(year.textContent);
      } else {
        year.classList.remove("active");
        year.classList.add("font-regular");
        year.classList.remove("font-DemiBold");
        gsap.to(year, { fontSize: "1.04em", duration: 0.5 });
      }
    });
  }

  function updateYear(year) {
    console.log(year);
    localStorage.setItem("selectedAge", year);
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

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const message = event.data;

    if (message.includes("Start pressed!")) {
      const activeElement = document.querySelector(".age.active");
      if (activeElement) {
        const selectedAge = parseInt(activeElement.textContent);
        localStorage.setItem("selectedAge", selectedAge);
        console.log("Età salvata:", selectedAge);
      } else {
        console.error("Nessun elemento .age.active trovato");
      }

      const body = document.body;
      body.style.transition = "opacity 2s";
      body.style.opacity = 0;

      setTimeout(() => {
        window.location.href = "3-death.html";
      }, 2000);
    }

    const encoderValue = parseInt(message.split(" ")[2]);
    if (!isNaN(encoderValue)) {
      if (encoderValue > lastEncoderValue) {
        rotateYears("right");
      } else if (encoderValue < lastEncoderValue) {
        rotateYears("left");
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
