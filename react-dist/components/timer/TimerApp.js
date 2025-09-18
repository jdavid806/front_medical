import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { usePageTimer } from "./hooks/usePageTimer.js";
export const TimerApp = /*#__PURE__*/forwardRef(({
  onTimeUpdate
}, ref) => {
  const {
    elapsedTime,
    reset,
    start
  } = usePageTimer();
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