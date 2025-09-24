import { useState, useCallback } from 'react';
import { ConfigurationStep } from '../types';

export const useSystemConfiguration = (steps: ConfigurationStep[], initialStep: number = 0) => {
    const [activeIndex, setActiveIndex] = useState<number>(initialStep);

    console.log('🔄 Hook - activeIndex actual:', activeIndex);

    const goToNext = useCallback(() => {
        console.log('➡️ Ejecutando goToNext...');
        setActiveIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= steps.length) {
                return prevIndex;
            }
            return nextIndex;
        });
    }, [steps.length]);

    const goToPrevious = useCallback(() => {
        setActiveIndex((prevIndex) => {
            const prevIndexNew = prevIndex - 1;
            if (prevIndexNew < 0) {
                return prevIndex;
            }
            return prevIndexNew;
        });
    }, []);

    const goToStep = useCallback((index: number) => {
        if (index >= 0 && index < steps.length) {
            setActiveIndex(index);
        } else {
        }
    }, [steps.length]);

    return {
        activeIndex,
        goToNext,
        goToPrevious,
        goToStep,
        totalSteps: steps.length,
        currentStep: steps[activeIndex]
    };
};