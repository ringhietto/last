document.addEventListener("DOMContentLoaded", () => {
  const years = document.querySelectorAll(".year");
  const circle = document.querySelector(".year-circle");
  const xOffset = -960;
  const yOffset = -1000;
  let centerX, centerY;
  let currentIndex = 15;
  let lastEncoderValue = 0;

  // Controlla se è stato selezionato gennaio
  const isJanuary = localStorage.getItem("selectedMonth") === "JANUARY";

  // Nascondi 2025 se è stato selezionato gennaio
  const year2025 = document.getElementById("year20");
  if (isJanuary && year2025) {
    year2025.style.display = "none";
  }

  function updateCenter() {
    const circleRect = circle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / years.length;
    const radius = 850;
    const activeFontSize = 2.5;
    const normalFontSize = 1;

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
    localStorage.setItem("selectedYear", year);
  }

  function rotateYears(direction) {
    if (direction === "left") {
      // Non permettere di andare oltre il 2025
      if (currentIndex <= 15) return;
      currentIndex = (currentIndex - 1 + years.length) % years.length;
    } else if (direction === "right") {
      // Mantiene il limite superiore esistente
      if (currentIndex >= 19) return;
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

    if (message === "Short press detected!") {
      window.location.href = "7-recap.html";
    }

    if (message === "Double press detected!") {
      const activeMonth = localStorage.getItem("selectedMonth");
      if (
        activeMonth === "APRIL" ||
        activeMonth === "JUNE" ||
        activeMonth === "SEPTEMBER" ||
        activeMonth === "NOVEMBER"
      ) {
        window.location.href = "5-day-30.html";
      } else if (activeMonth === "FEBRUARY") {
        window.location.href = "5-day-28.html";
      } else {
        // JANUARY, MARCH, MAY, JULY, AUGUST, OCTOBER, DECEMBER hanno 31 giorni
        window.location.href = "5-day-31.html";
      }
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
