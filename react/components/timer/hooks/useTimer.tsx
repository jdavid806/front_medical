import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerReturn {
    time: number;
    currentTime: Date;
    start: () => void;
    stop: () => void;
    reset: () => void;
    restart: () => void;
    formatTime: (includeMilliseconds?: boolean) => string;
    formatCurrentTime: (includeSeconds?: boolean) => string;
}

interface UseTimerOptions {
    autoStart?: boolean;
    interval?: number;
    startFromCurrentTime?: boolean;
}

const useTimer = (options: UseTimerOptions = {}): UseTimerReturn => {
    const {
        autoStart = false,
        interval = 10,
        startFromCurrentTime = true
    } = options;

    const [time, setTime] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(startFromCurrentTime ? Date.now() : 0);
    const accumulatedTimeRef = useRef<number>(0);
    const baseTimeRef = useRef<number>(startFromCurrentTime ? Date.now() : 0);

    // Función para limpiar el intervalo
    const clearTimerInterval = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    // Función para obtener la hora actual basada en el tiempo transcurrido
    const getCurrentTime = useCallback((): Date => {
        if (startFromCurrentTime) {
            return new Date(baseTimeRef.current + time);
        }
        return new Date(time);
    }, [time, startFromCurrentTime]);

    // Función para iniciar el cronómetro
    const start = useCallback(() => {
        if (time > 0) return;

        if (startFromCurrentTime) {
            startTimeRef.current = Date.now() - accumulatedTimeRef.current;
            baseTimeRef.current = startTimeRef.current;
        } else {
            startTimeRef.current = Date.now() - accumulatedTimeRef.current;
        }

        intervalRef.current = setInterval(() => {
            setTime(Date.now() - startTimeRef.current);
        }, interval);
    }, [interval, startFromCurrentTime]);

    // Función para detener el cronómetro
    const stop = useCallback(() => {
        if (time === 0) return;

        accumulatedTimeRef.current = Date.now() - startTimeRef.current;
        clearTimerInterval();
    }, [clearTimerInterval]);

    // Función para reiniciar el cronómetro
    const reset = useCallback(() => {
        setTime(0);
        accumulatedTimeRef.current = 0;

        if (startFromCurrentTime) {
            startTimeRef.current = Date.now();
            baseTimeRef.current = startTimeRef.current;
        } else {
            startTimeRef.current = Date.now();
        }
    }, [startFromCurrentTime]);

    // Función para reiniciar completamente
    const restart = useCallback(() => {
        stop();
        reset();
    }, [stop, reset]);

    // Función para formatear el tiempo transcurrido
    const formatTime = useCallback((includeMilliseconds: boolean = false): string => {
        const hours = Math.floor(time / 3600000);
        const minutes = Math.floor((time % 3600000) / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = Math.floor((time % 1000) / 10);

        const pad = (num: number, length: number = 2): string =>
            num.toString().padStart(length, '0');

        if (includeMilliseconds) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 2)}`;
        }

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }, [time]);

    // Función para formatear la hora actual
    const formatCurrentTime = useCallback((includeSeconds: boolean = true): string => {
        const current = getCurrentTime();

        const hours = current.getHours();
        const minutes = current.getMinutes();
        const seconds = current.getSeconds();

        const pad = (num: number): string => num.toString().padStart(2, '0');

        if (includeSeconds) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        }

        return `${pad(hours)}:${pad(minutes)}`;
    }, [getCurrentTime]);

    // Efecto para manejar el inicio automático
    useEffect(() => {
        if (autoStart) {
            console.log('autoStart');
            start();
        }

        return () => {
            clearTimerInterval();
        };
    }, [autoStart, start, clearTimerInterval]);

    return {
        time,
        currentTime: getCurrentTime(),
        start,
        stop,
        reset,
        restart,
        formatTime,
        formatCurrentTime,
    };
};

export default useTimer;