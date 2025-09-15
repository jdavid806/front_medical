import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { usePageTimer } from "./hooks/usePageTimer.js";
export const TimerApp = /*#__PURE__*/forwardRef(({
  autoStart = true,
  onTimeUpdate
}, ref) => {
  const {
    elapsedTime,
    reset,
    start
  } = usePageTimer(autoStart);
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(elapsedTime);
    }
  }, [elapsedTime.totalMs, onTimeUpdate]);
  useImperativeHandle(ref, () => ({
    elapsedTime,
    reset,
    start
  }));
  return /*#__PURE__*/React.createElement("span", null, elapsedTime.hours, ":", elapsedTime.minutes, ":", elapsedTime.seconds);
});