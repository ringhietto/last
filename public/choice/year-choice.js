document.addEventListener("DOMContentLoaded", () => {
  const years = document.querySelectorAll(".year");
  const circle = document.querySelector(".year-circle");
  const xOffset = -860; // Offset orizzontale per centrare gli anni
  const yOffset = -575; // Offset verticale per posizionare gli anni
  let centerX, centerY;
  let currentIndex = 8; // Anno centrale iniziale
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
    const angleStep = 360 / years.length;
    const radius = 1000;
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
        updateYear(year.textContent);
      } else {
        year.classList.remove("active");
      }
    });
  }

  function updateYear(year) {
    // Qui puoi aggiungere la logica per gestire il cambio dell'anno
    console.log("Anno selezionato:", year);
  }

  function rotateYears(direction) {
    if (isRotating) return;

    isRotating = true;
    targetIndex =
      direction === "right"
        ? (currentIndex + 1) % years.length
        : (currentIndex - 1 + years.length) % years.length;

    // Aggiungi l'animazione dell'encoder
    const encoderImage = document.querySelector(".encoder-image");
    if (encoderImage) {
      encoderImage.classList.add("rotating");

      // Rimuovi la classe dopo l'animazione
      setTimeout(() => {
        encoderImage.classList.remove("rotating");
      }, 500);
    }

    // Animazione del cerchio
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

  // Inizializza la posizione iniziale
  updateCenter();

  window.addEventListener("resize", updateCenter);

  // Animazione continua del cerchio
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
