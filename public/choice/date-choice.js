document.addEventListener("DOMContentLoaded", () => {
  const dates = document.querySelectorAll(".date");
  const circle = document.querySelector(".date-circle");
  const xOffset = -860;
  const yOffset = -575;
  let centerX, centerY;
  let currentIndex = 8;
  let lastEncoderValue = 0;
  let targetIndex = currentIndex;
  let isRotating = false;
  let currentRotation = 0;
  let targetRotation = 0;

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
      const angle = angleStep * relativeIndex - 180;

      if (index === 0 || index === 19 || index === 12 || index === 11) {
        date.style.display = "none";
        return;
      } else {
        date.style.display = "block";
      }

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
    if (isRotating) return;

    if (currentIndex === 13) {
      // date14
      // Può andare solo a destra
      if (direction === "left") return;
    } else if (currentIndex === 18) {
      // date19
      // Può andare solo a sinistra
      if (direction === "right") return;
    }
    // date15,16,17,18 possono andare in entrambe le direzioni
    // Non serve una condizione specifica per queste

    isRotating = true;
    targetIndex =
      direction === "right"
        ? (currentIndex + 1) % dates.length
        : (currentIndex - 1 + dates.length) % dates.length;

    const encoderImage = document.querySelector(".encoder-image");
    if (encoderImage) {
      encoderImage.classList.add("rotating");

      setTimeout(() => {
        encoderImage.classList.remove("rotating");
      }, 500);
    }

    if (direction === "right") {
      targetRotation += 36;
    } else {
      targetRotation -= 36;
    }

    gsap.to(circle, {
      rotation: targetRotation,
      duration: 0.5,
      ease: "power2.out",
    });

    requestAnimationFrame(animateRotation);
  }

  function animateRotation() {
    const rotationDiff = targetIndex - currentIndex;

    if (Math.abs(rotationDiff) < 0.1) {
      currentIndex = targetIndex;
      isRotating = false;
      updatePositions();
      return;
    }

    currentIndex += rotationDiff * 0.1;
    updatePositions();

    requestAnimationFrame(animateRotation);
  }

  updateCenter();
  window.addEventListener("resize", updateCenter);

  gsap.to(circle, {
    rotation: "+=360",
    duration: 5,
    repeat: -1,
    ease: "linear",
    modifiers: {
      rotation: gsap.utils.wrap(0, 360),
    },
  });

  const socket = new WebSocket("ws://127.0.0.1:8001");

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    const encoderValue = parseInt(event.data.split(" ")[2]);
    if (!isNaN(encoderValue)) {
      if (encoderValue > lastEncoderValue) {
        rotateDates("right");
      } else if (encoderValue < lastEncoderValue) {
        rotateDates("left");
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
