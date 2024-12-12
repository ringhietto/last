// Funzione per ottenere il parametro da JSON a seconda della scelta
function updateConsequences(choice) {
    const parameters = getParameters(choice);

    // Aggiorna i parametri nella pagina
    document.getElementById('media-impact').style.width = parameters.mediaImpact + '%';
    document.getElementById('shock').style.width = parameters.shock + '%';
    document.getElementById('impact-text').textContent = parameters.impactText;
    document.getElementById('place').textContent = parameters.place;
    document.getElementById('mode').textContent = parameters.mode;
    document.getElementById('reaction').textContent = parameters.reaction;
    document.getElementById('total-price').textContent = parameters.price;
}

// Funzione per ottenere i parametri di ogni scelta
function getParameters(choice) {
    switch(choice) {
        case 'Murder':
            return {
                mediaImpact: 70,
                shock: 80,
                impactText: "Your death caused great shock, and the media is still discussing it.",
                place: "City",
                mode: "Homicide",
                reaction: "Outrage",
                price: "$2,500,000"
            };
        case 'Illness':
            return {
                mediaImpact: 40,
                shock: 50,
                impactText: "The illness spread awareness, but it wasn't widely covered in the media.",
                place: "Hospital",
                mode: "Disease",
                reaction: "Sympathy",
                price: "$1,000,000"
            };
        case 'Overdose':
            return {
                mediaImpact: 60,
                shock: 70,
                impactText: "The overdose shocked the community, bringing attention to drug issues.",
                place: "Home",
                mode: "Overdose",
                reaction: "Shock",
                price: "$1,800,000"
            };
        case 'Suicide':
            return {
                mediaImpact: 80,
                shock: 90,
                impactText: "Suicide generated widespread media coverage, but the shock was overwhelming.",
                place: "Private",
                mode: "Suicide",
                reaction: "Sadness",
                price: "$2,000,000"
            };
        case 'Accident':
            return {
                mediaImpact: 50,
                shock: 60,
                impactText: "The accident was reported, but the impact was less significant compared to others.",
                place: "Road",
                mode: "Accident",
                reaction: "Sadness",
                price: "$1,200,000"
            };
        default:
            return {
                mediaImpact: 0,
                shock: 0,
                impactText: "Please select a valid choice.",
                place: "-",
                mode: "-", }
