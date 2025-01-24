document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("ws://127.0.0.1:8001");
  const videoContainer = document.querySelector('.video-container');
  const video = document.getElementById('deathVideo');
  
  // Funzione per ottenere il tipo di morte attualmente selezionato
  function getCurrentDeath() {
    const activeWord = document.querySelector('.word.active');
    return activeWord ? activeWord.textContent.toLowerCase() : 'accident';
  }

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    if (event.data.includes("Start pressed!")) {
      const currentDeath = getCurrentDeath();
      
      // Imposta il video corretto in base alla scelta
      video.querySelector('source').src = `asset/videos/${currentDeath}.mov`;
      video.load(); // Ricarica il video con la nuova source
      
      // Mostra il container del video
      videoContainer.classList.add('active');
      
      // Riproduci il video
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
      
      // Quando il video finisce
      video.onended = () => {
        // Nascondi il container del video
        videoContainer.classList.remove('active');
        // Reimposta il video
        video.currentTime = 0;
      };
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error:", error);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
});