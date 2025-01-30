document.addEventListener("DOMContentLoaded", () => {
  const months = document.querySelectorAll(".month");
  const yearContainer = document.querySelector(".year-container");
  const yearCircle = document.querySelector(".year-circle");
  const monthCircle = document.querySelector(".month-circle");
  const xOffset = -960;
  const yOffset = -740;
  let centerX, centerY;
  let currentIndex = 3;
  let lastEncoderValue = 10000;
  let stopEncoder = false;

  function updateCenter() {
    const circleRect = monthCircle.getBoundingClientRect();
    centerX = circleRect.left + circleRect.width / 2;
    centerY = circleRect.top + circleRect.height / 2;
    updatePositions();
  }

  function updatePositions() {
    const angleStep = 360 / months.length;
    const radius = 1000;
    const activeFontSize = 2.5;
    const normalFontSize = 1.04;

    const distanceActive = activeFontSize * 10;
    const distanceNormal = normalFontSize * 5;

    months.forEach((month, index) => {
      const relativeIndex =
        (index - currentIndex + months.length) % months.length;
      const angle = angleStep * relativeIndex - 165;

      month.style.display = "block";

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
        relativeIndex === 0 || relativeIndex === months.length - 1 ? 0 : 1;

      month.style.transform = `translate(${x}px, ${y}px)`;
      month.style.opacity = opacity;

      if (relativeIndex === 5) {
        month.classList.add("active");
        month.classList.remove("font-regular");
        month.classList.add("font-DemiBold");
        gsap.to(month, { fontSize: "2.5em", duration: 0.5 });
        updateMonth(month.textContent);
      } else {
        month.classList.remove("active");
        month.classList.add("font-regular");
        month.classList.remove("font-DemiBold");
        gsap.to(month, { fontSize: "1.04em", duration: 0.5 });
      }
    });
  }

  function updateMonth(month) {
    console.log("Mese selezionato:", month);
    localStorage.setItem("selectedMonth", month);
    localStorage.setItem("isJanuary", month === "JANUARY" ? "true" : "false");
  }

  function rotateMonths(direction) {
    if (direction === "left") {
      currentIndex = (currentIndex - 1 + months.length) % months.length;
    } else if (direction === "right") {
      currentIndex = (currentIndex + 1) % months.length;
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
      const activeMonth = Array.from(months).find((month) =>
        month.classList.contains("active")
      );
      stopEncoder = true;
      if (activeMonth) {
        const selectedMonth = activeMonth.textContent;
        if (activeMonth.id === "month10" || activeMonth.id === "month22") {
          window.location.href = "5-day-28.html";
        } else if (
          activeMonth.id === "month2" ||
          activeMonth.id === "month5" ||
          activeMonth.id === "month7" ||
          activeMonth.id === "month12" ||
          activeMonth.id === "month14" ||
          activeMonth.id === "month17" ||
          activeMonth.id === "month19" ||
          activeMonth.id === "month24"
        ) {
          window.location.href = "5-day-30.html";
          localStorage.setItem("selectedMonth", selectedMonth);
        } else if (
          activeMonth.id === "month1" ||
          activeMonth.id === "month3" ||
          activeMonth.id === "month4" ||
          activeMonth.id === "month6" ||
          activeMonth.id === "month8" ||
          activeMonth.id === "month9" ||
          activeMonth.id === "month11" ||
          activeMonth.id === "month13" ||
          activeMonth.id === "month15" ||
          activeMonth.id === "month16" ||
          activeMonth.id === "month18" ||
          activeMonth.id === "month20" ||
          activeMonth.id === "month21" ||
          activeMonth.id === "month23"
        ) {
          window.location.href = "5-day-31.html";
          localStorage.setItem("selectedMonth", selectedMonth);
        }
      }
    } else if (stopEncoder === false) {
      const encoderValue = parseInt(message.split(" ")[2]);
      if (!isNaN(encoderValue)) {
        if (encoderValue > lastEncoderValue) {
          rotateMonths("right");
        } else if (encoderValue < lastEncoderValue) {
          rotateMonths("left");
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
