import { useState, useEffect, useRef, useCallback } from 'react';
const useTimer = (options = {}) => {
  const {
    autoStart = false,
    interval = 10,
    startFromCurrentTime = true
  } = options;
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(startFromCurrentTime ? Date.now() : 0);
  const accumulatedTimeRef = useRef(0);
  const baseTimeRef = useRef(startFromCurrentTime ? Date.now() : 0);

  // Función para limpiar el intervalo
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Función para obtener la hora actual basada en el tiempo transcurrido
  const getCurrentTime = useCallback(() => {
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
  const formatTime = useCallback((includeMilliseconds = false) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor(time % 3600000 / 60000);
    const seconds = Math.floor(time % 60000 / 1000);
    const milliseconds = Math.floor(time % 1000 / 10);
    const pad = (num, length = 2) => num.toString().padStart(length, '0');
    if (includeMilliseconds) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 2)}`;
    }
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }, [time]);

  // Función para formatear la hora actual
  const formatCurrentTime = useCallback((includeSeconds = true) => {
    const current = getCurrentTime();
    const hours = current.getHours();
    const minutes = current.getMinutes();
    const seconds = current.getSeconds();
    const pad = num => num.toString().padStart(2, '0');
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
    formatCurrentTime
  };
};
export default useTimer;