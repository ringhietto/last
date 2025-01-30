socket.onmessage = (event) => {
  const message = event.data;

  if (message === "Short press detected!") {
    const body = document.body;
    body.style.transition = "opacity 2s"; // Imposta la transizione per la dissolvenza
    body.style.opacity = 0; // Inizia la dissolvenza

    setTimeout(() => {
      window.location.href = "9-thankyou.html"; // Naviga verso thankyou.html
    }, 2000); // Aspetta 2 secondi prima di navigare
  }

  if (message === "Double press detected!") {
    window.location.href = "3-death.html"; // Modificato per andare a index
  }
};

// Dataset per le morti
const deathData = {
  SUICIDE: {
    price: "1,800,000 $",
    stage: 3,
    mediaImpact: "500,000 $",
  },
  MURDER: {
    price: "2,200,000 $",
    stage: 5,
    mediaImpact: "1,000,000 $",
  },
  ACCIDENT: {
    price: "2,500,000 $",
    stage: 4,
    mediaImpact: "800,000 $",
  },
  ILLNESS: {
    price: "1,200,000 $",
    stage: 1,
    mediaImpact: "200,000 $",
  },
  OVERDOSE: {
    price: "1,400,000 $",
    stage: 2,
    mediaImpact: "400,000 $",
  },
};

// Funzione per l'impatto dell'età
function getAgeImpact(age) {
  if (age >= 18 && age <= 30) {
    return "1,000,000 $";
  } else if (age >= 31 && age <= 40) {
    return "500,000 $";
  } else if (age >= 41 && age <= 60) {
    return "100,000 $";
  } else if (age >= 61 && age <= 80) {
    return "50,000 $";
  } else if (age >= 81 && age <= 90) {
    return "0 $";
  }
  return "N/A";
}

document.addEventListener("DOMContentLoaded", () => {
  // Recupera il tipo di morte selezionato da localStorage
  const selectedDeath = localStorage.getItem("selectedDeath");

  // Recupera l'età selezionata da localStorage
  const selectedAge = parseInt(localStorage.getItem("selectedAge"));

  // Calcola la durata del soggiorno
  const stayDuration = Math.max(0, 90 - selectedAge);

  // Funzione per calcolare il costo annuale in base all'età
  function getYearlyCost(age) {
    if (age >= 1 && age <= 30) {
      return 400000;
    } else if (age > 30 && age <= 60) {
      return 200000;
    } else {
      return 160000;
    }
  }

  // Calcola il costo totale del soggiorno
  const yearlyCost = getYearlyCost(selectedAge);
  const totalStayCost = yearlyCost * stayDuration;

  // Formatta il prezzo con il separatore delle migliaia e il simbolo $
  const formattedStayCost = totalStayCost.toLocaleString() + " $";

  // Aggiorna il numero di anni nel titolo
  const stayYearsElement = document.getElementById("stayYears");
  if (stayYearsElement) {
    stayYearsElement.textContent = stayDuration;
  }

  // Aggiorna il costo totale del soggiorno
  const stayNameElement = document.getElementById("stay-name");
  if (stayNameElement) {
    stayNameElement.textContent = formattedStayCost;
  }

  // Aggiorna il nome della morte
  const deathNameElement = document.getElementById("death-name");
  if (deathNameElement && selectedDeath) {
    deathNameElement.textContent = selectedDeath;
  }

  // Aggiorna il prezzo invece dello stage number
  const stageNameElement = document.getElementById("stage-name");
  if (stageNameElement && selectedDeath && deathData[selectedDeath]) {
    stageNameElement.textContent = deathData[selectedDeath].price;
  }

  // Aggiorna l'age impact
  const ageImpactElement = document.getElementById("age-impact-name");
  if (ageImpactElement && !isNaN(selectedAge)) {
    ageImpactElement.textContent = getAgeImpact(selectedAge);
  }

  // Aggiorna il media impact
  const mediaImpactElement = document.getElementById("media-impact-name");
  if (mediaImpactElement && selectedDeath && deathData[selectedDeath]) {
    mediaImpactElement.textContent = deathData[selectedDeath].mediaImpact;
  }

  function parsePrice(priceString) {
    return parseInt(priceString.replace(/[,$]/g, ""));
  }

  function formatPrice(number) {
    return number.toLocaleString() + " $";
  }

  // Calcola il prezzo totale
  function calculateTotalPrice() {
    const deathPrice = parsePrice(deathData[selectedDeath].price);
    const ageImpactPrice = parsePrice(getAgeImpact(selectedAge));
    const mediaImpactPrice = parsePrice(deathData[selectedDeath].mediaImpact);
    const transportPrice = 10000;
    const stayPrice = totalStayCost;

    const totalPrice =
      deathPrice +
      ageImpactPrice +
      mediaImpactPrice +
      transportPrice +
      stayPrice;

    const finalPriceElement = document.getElementById("final-price-name");
    if (finalPriceElement) {
      finalPriceElement.textContent = formatPrice(totalPrice);
    }
  }

  calculateTotalPrice();
});
