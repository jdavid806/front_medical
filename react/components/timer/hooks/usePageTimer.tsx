import { useState, useEffect } from 'react';

// Generar una clave única para localStorage basada en la URL
const generateStorageKey = (baseKey: string): string => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    return `pageTimer_${baseKey}_${btoa(url)}`;
};

export const usePageTimer = (autoStart = true) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Cargar estado guardado al inicializar (solo para esta URL)
    useEffect(() => {
        const savedTime = localStorage.getItem(generateStorageKey('elapsedTime'));
        const savedStartTime = localStorage.getItem(generateStorageKey('startTime'));
        const savedIsRunning = localStorage.getItem(generateStorageKey('isRunning'));

        if (savedTime) {
            setElapsedTime(parseInt(savedTime));
        }

        if (savedStartTime && savedStartTime !== 'null') {
            setStartTime(parseInt(savedStartTime));
        }

        if (savedIsRunning) {
            setIsRunning(savedIsRunning === 'true');
        }

        console.log('savedTime', savedTime);
        console.log('savedStartTime', savedStartTime);
        console.log('savedIsRunning', savedIsRunning);
    }, []);

    // Guardar en localStorage cuando cambie el estado
    useEffect(() => {
        localStorage.setItem(generateStorageKey('elapsedTime'), elapsedTime.toString());
    }, [elapsedTime]);

    useEffect(() => {
        localStorage.setItem(generateStorageKey('startTime'), startTime ? startTime.toString() : '');
    }, [startTime]);

    useEffect(() => {
        localStorage.setItem(generateStorageKey('isRunning'), isRunning.toString());
    }, [isRunning]);

    // Formatear el tiempo transcurrido
    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            totalMs: milliseconds,
            totalSeconds
        };
    };

    // Iniciar el temporizador
    const start = () => {
        if (!isRunning) {
            const newStartTime = Date.now() - elapsedTime;
            setStartTime(newStartTime);
            setIsRunning(true);
        }
    };

    // Detener el temporizador
    const stop = () => {
        if (isRunning) {
            setElapsedTime(Date.now() - (startTime || Date.now()));
            setIsRunning(false);
        }
    };

    // Reiniciar el temporizador
    const reset = () => {
        setElapsedTime(0);
        if (isRunning) {
            setStartTime(Date.now());
        } else {
            setStartTime(null);
        }
        // Limpiar localStorage para esta URL específica
        localStorage.removeItem(generateStorageKey('elapsedTime'));
        localStorage.removeItem(generateStorageKey('startTime'));
        localStorage.removeItem(generateStorageKey('isRunning'));
    };

    // Obtener el tiempo transcurrido formateado
    const getElapsedTime = () => {
        return formatTime(elapsedTime);
    };

    // Efecto principal para el temporizador
    useEffect(() => {

        let intervalId: number | null = null;

        console.log('isRunning', isRunning);
        console.log('startTime', startTime);

        if (isRunning && startTime) {
            intervalId = setInterval(() => {
                console.log('startTime', startTime);
                console.log('Date.now()', Date.now());
                console.log('Date.now() - startTime', Date.now() - startTime);

                setElapsedTime(Date.now() - startTime);
            }, 100);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isRunning, startTime]);

    return {
        start,
        stop,
        reset,
        isRunning,
        getElapsedTime,
        elapsedTime: getElapsedTime()
    };
};