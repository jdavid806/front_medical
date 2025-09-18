import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { usePageTimer } from './hooks/usePageTimer';

interface TimerAppProps {
    onTimeUpdate?: (time: {
        hours: string;
        minutes: string;
        seconds: string;
        totalMs: number;
        totalSeconds: number;
    }) => void;
    ref?: React.RefObject<TimerAppRef>;
}

interface TimerAppRef {
    elapsedTime: {
        hours: string;
        minutes: string;
        seconds: string;
        totalMs: number;
        totalSeconds: number;
    };
    reset: () => void;
    start: () => void;
}

export const TimerApp: React.FC<TimerAppProps> = forwardRef(({
    onTimeUpdate
}, ref) => {
    const { elapsedTime, reset, start } = usePageTimer();

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

    return (
        <span>
            {elapsedTime.hours}:{elapsedTime.minutes}:{elapsedTime.seconds}
        </span>
    );
});