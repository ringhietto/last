// movingpages.js

// Funzione per cambiare pagina senza animazioni
function changePage(url) {
    window.location.href = url;
}

// Event listener per le frecce
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        if (window.location.pathname.includes('index.html')) {
            changePage('pagina2.html');
        } else if (window.location.pathname.includes('pagina2.html')) {
            changePage('pagina3.html');
        }
    } else if (event.key === 'ArrowUp') {
        if (window.location.pathname.includes('pagina2.html')) {
            changePage('index.html');
        } else if (window.location.pathname.includes('pagina3.html')) {
            changePage('pagina2.html');
        }
    }
});