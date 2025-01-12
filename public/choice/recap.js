document.addEventListener("DOMContentLoaded", () => {
  // Recupera l'anno selezionato da localStorage
  const selectedYear = localStorage.getItem("selectedYear");
  if (selectedYear) {
    document.querySelector("#year-name").textContent = selectedYear; // Imposta l'anno nel <span>
    console.log(selectedYear); // Log dell'anno selezionato
  }

  // Puoi aggiungere qui altre logiche se necessario
});
