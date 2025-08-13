// voiceAnnouncer.js
let synth;
let voices = [];
let isInitialized = false;
let voicesLoaded = false;
let voiceLoadListeners = [];

const loadVoices = () => {
    voices = synth.getVoices();
    if (voices.length > 0) {
        voicesLoaded = true;
        voiceLoadListeners.forEach(callback => callback());
        voiceLoadListeners = [];
    }
};

function init() {
    if (typeof window === 'undefined') return;
    if (isInitialized) return;

    synth = window.speechSynthesis;

    synth.onvoiceschanged = loadVoices;

    loadVoices();
    isInitialized = true;
}

async function ensureVoicesLoaded() {
    if (voicesLoaded) return;

    return new Promise((resolve) => {
        if (voicesLoaded) {
            resolve();
        } else {
            voiceLoadListeners.push(resolve);
            setTimeout(resolve, 3000);
        }
    });
}

export async function speak({ text, options = {} }) {
    if (!isInitialized) init();
    if (!synth) {
        console.warn('SpeechSynthesis no disponible');
        return;
    }

    await ensureVoicesLoaded();

    synth.cancel();

    const config = {
        voice: voices.find(v => v.lang.includes('es')),
        rate: 0.9,
        pitch: 1,
        volume: 1,
        ...options
    };

    const utterance = new SpeechSynthesisUtterance(text);

    Object.assign(utterance, config);

    console.log(utterance, config);


    synth.speak(utterance);
    return utterance;
}

export async function callTicket({ nombre, turno, modulo, options = {} }) {
    const text = `Turno número ${turno}, ${nombre}, favor acercarse al módulo ${modulo}.`;
    console.log(text, options);

    return await speak({ text, options });
}

export async function callPatientToOffice({ nombre, office, options = {} }) {
    const text = `${nombre}, favor acercarse al consultorio ${office}.`;
    return await speak({ text, options });
}

export function cancelSpeak() {
    if (synth) synth.cancel();
}

export function pauseSpeak() {
    if (synth) synth.pause();
}

export function resumeSpeak() {
    if (synth) synth.resume();
}

init();