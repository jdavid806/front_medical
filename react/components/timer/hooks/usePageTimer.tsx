import { useState, useEffect } from 'react';
import { formatTimeByMilliseconds, generateURLStorageKey } from '../../../../services/utilidades';

export const usePageTimer = (autoStart = true) => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // Inicialmente falso
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // Nuevo estado para controlar inicialización

    // Cargar estado guardado al inicializar (solo para esta URL)
    useEffect(() => {
        const savedTime = localStorage.getItem(generateURLStorageKey('elapsedTime'));
        const savedStartTime = localStorage.getItem(generateURLStorageKey('startTime'));
        const savedIsRunning = localStorage.getItem(generateURLStorageKey('isRunning'));

        if (savedTime) {
            setElapsedTime(parseInt(savedTime));
        }

        if (savedStartTime && savedStartTime !== 'null') {
            setStartTime(parseInt(savedStartTime));
        }

        if (savedIsRunning) {
            setIsRunning(savedIsRunning === 'true');
        }

        setIsInitialized(true); // Marcar como inicializado
    }, []);

    // Efecto para iniciar automáticamente después de cargar el estado
    useEffect(() => {
        if (isInitialized && autoStart && !isRunning) {
            // Si no hay startTime guardado, iniciar desde cero
            if (startTime === null) {
                const newStartTime = Date.now() - elapsedTime;
                setStartTime(newStartTime);
            }
            setIsRunning(true);
        }
    }, [isInitialized, autoStart, isRunning, startTime, elapsedTime]);

    // Guardar en localStorage cuando cambie el estado
    useEffect(() => {
        localStorage.setItem(generateURLStorageKey('elapsedTime'), elapsedTime.toString());
    }, [elapsedTime]);

    useEffect(() => {
        localStorage.setItem(generateURLStorageKey('startTime'), startTime ? startTime.toString() : '');
    }, [startTime]);

    useEffect(() => {
        localStorage.setItem(generateURLStorageKey('isRunning'), isRunning.toString());
    }, [isRunning]);

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
        localStorage.removeItem(generateURLStorageKey('elapsedTime'));
        localStorage.removeItem(generateURLStorageKey('startTime'));
        localStorage.removeItem(generateURLStorageKey('isRunning'));
    };

    // Obtener el tiempo transcurrido formateado
    const getElapsedTime = () => {
        return formatTimeByMilliseconds(elapsedTime);
    };

    // Efecto principal para el temporizador
    useEffect(() => {
        let intervalId: number | null = null;

        if (isRunning && startTime) {
            intervalId = setInterval(() => {
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