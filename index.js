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
    const message = new SpeechSynthesisUtterance(text);
    if (voiceSelected) {
      message.voice = voiceSelected;
    }
    if (rateSelected) {
      message.rate = rateSelected;
    }
    speechSynthesis.speak(message);
  } catch (error) {
    console.error("Error:", error);
  }
});

selectVoice.addEventListener("change", () => {
  const selectIndex = parseInt(selectVoice.value);
  voiceSelected = allVoices[selectIndex];
});

selectRate.addEventListener("change", () => {
  rateSelected = parseFloat(selectRate.value);
});

/*espera q cargue los tipos */
window.speechSynthesis.onvoiceschanged = () => {
  allVoices = window.speechSynthesis.getVoices();
  selectVoice.innerHTML =
    '<option value="" selected disabled>Selecciona una voz</option>';

  allVoices.forEach((voice, index) => {
    const optionVoice = document.createElement("option");
    optionVoice.value = index;
    optionVoice.textContent = voice.name;
    selectVoice.appendChild(optionVoice);
  });
};

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
