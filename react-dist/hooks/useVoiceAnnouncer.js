import { useEffect, useState } from 'react';
const useVoiceAnnouncer = () => {
  const [synth, setSynth] = useState(null);
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const speechSynth = window.speechSynthesis;
    setSynth(speechSynth);
    const loadVoices = () => {
      const availableVoices = speechSynth.getVoices();
      setVoices(availableVoices);
    };
    speechSynth.onvoiceschanged = loadVoices;
    loadVoices();
    return () => {
      speechSynth.onvoiceschanged = null;
    };
  }, []);
  const speak = text => {
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const spanishVoice = voices.find(v => v.lang.includes('es'));
    if (spanishVoice) utterance.voice = spanishVoice;
    utterance.rate = 0.9;
    synth.speak(utterance);
  };
  const callTicket = (nombre, turno, modulo) => {
    speak(`Turno número ${turno}, ${nombre}, favor acercarse al módulo ${modulo}.`);
  };
  return {
    speak,
    callTicket
  };
};
export default useVoiceAnnouncer;