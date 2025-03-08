document.addEventListener("DOMContentLoaded", () => {
  const timerElement = document.getElementById("timer");
  const finishBtn = document.getElementById("finishBtn");
  const modalTimer = document.getElementById("modalTimer");

  let startTime = new Date();

  function updateTimer() {
    const now = new Date();
    const elapsedTime = now - startTime;
    const hours = Math.floor(elapsedTime / 3600000);
    const minutes = Math.floor((elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    timerElement.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  setInterval(updateTimer, 1000);

  finishBtn.addEventListener("click", () => {
    if (modalTimer) {
      modalTimer.value = timerElement.textContent; // Asignar valor al modal
    } else {
      console.log("Error al buscar el temporizador del modal.");
    }
  });
});
