socket.onmessage = (event) => {
  const message = event.data;

  if (message === "Start pressed!") {
    window.location.href = "9-thankyou.html"; // Naviga verso thankyou.html
  }
};
