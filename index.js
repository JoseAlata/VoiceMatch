let allVoices = [];
let voiceSelected = null;
let rateSelected = null;
let mediaRecorder;
let audioChunks = [];
const selectVoice = document.getElementById("selectVoice");
const selectRate = document.getElementById("selectRateVoice");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const playIcon = document.getElementById("playIcon");
const audioPlayer = document.getElementById("audioPlayer");

document.getElementById("btnEar").addEventListener("click", () => {
  try {
    const text = document.getElementById("voiceInput").value;
    if (!text) {
      alert("Por favor, ingresa un texto para sintetizar");
      return;
    }
    //options
    const voice = voiceSelected || "US English Female";
    const options = {};

    if (rateSelected) {
      options.rate = rateSelected;
    }
    responsiveVoice.speak(text, voice, options);
  } catch (error) {
    console.error("Error:", error);
  }
});

selectVoice.addEventListener("change", () => {
  voiceSelected = selectVoice.value;
});

selectRate.addEventListener("change", () => {
  rateSelected = parseFloat(selectRate.value);
});

navigator.mediaDevices
  .getUserMedia({ audio: true })
  .then((stream) => {
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioPlayer.src = audioUrl;
      audioChunks = []; // Limpiar para la próxima grabación
    };

    // Eventos de botones
    startBtn.onclick = () => {
      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
    };

    stopBtn.onclick = () => {
      mediaRecorder.stop();
      startBtn.disabled = false;
      stopBtn.disabled = true;
    };

    playIcon.onclick = () => {
      audioPlayer.play();
    };
  })
  .catch((err) => {
    alert("Error al acceder al micrófono: " + err);
  });
