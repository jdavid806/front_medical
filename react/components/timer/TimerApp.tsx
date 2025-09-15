import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { usePageTimer } from './hooks/usePageTimer';

interface TimerAppProps {
    autoStart?: boolean;
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
    autoStart = true,
    onTimeUpdate
}, ref) => {
    const { elapsedTime, reset, start } = usePageTimer(autoStart);

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