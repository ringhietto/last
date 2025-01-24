document.addEventListener("DOMContentLoaded", () => {
  console.log(
    "Contenuto raw di localStorage:",
    localStorage.getItem("selectedAge")
  );

  const selectedAge = parseInt(localStorage.getItem("selectedAge"));

  console.log("Età selezionata:", selectedAge);

  // Calculate stay duration
  const stayDuration = Math.max(0, 90 - selectedAge);

  console.log("Calcolo:", `90 - ${selectedAge} = ${stayDuration}`);

  const stayDurationElement = document.getElementById("stayDuration");
  if (stayDurationElement) {
    stayDurationElement.textContent = stayDuration;
    console.log("Durata soggiorno impostata:", stayDuration);
  } else {
    console.error("Elemento stayDuration non trovato nel DOM");
  }

  // Gestione della dissolvenza e navigazione
  const body = document.querySelector("body");
  gsap.set(body, { opacity: 0 });

  setTimeout(() => {
    gsap.to(body, {
      opacity: 1,
      duration: 1,
      onComplete: () => {
        setTimeout(() => {
          gsap.to(body, {
            opacity: 0,
            duration: 2,
            onComplete: () => {
              window.location.href = "8-scontrino.html";
            },
          });
        }, 3000);
      },
    });
  }, 500);
});
