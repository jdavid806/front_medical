import { useState, useCallback } from 'react';
export const useSystemConfiguration = (steps, initialStep = 0) => {
  const [activeIndex, setActiveIndex] = useState(initialStep);
  console.log('🔄 Hook - activeIndex actual:', activeIndex);
  const goToNext = useCallback(() => {
    console.log('➡️ Ejecutando goToNext...');
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= steps.length) {
        console.log('❌ No se puede avanzar más, último paso alcanzado');
        return prevIndex;
      }
      console.log('✅ Avanzando al paso:', nextIndex + 1, steps[nextIndex].label);
      return nextIndex;
    });
  }, [steps.length]);
  const goToPrevious = useCallback(() => {
    console.log('⬅️ Ejecutando goToPrevious...');
    setActiveIndex(prevIndex => {
      const prevIndexNew = prevIndex - 1;
      if (prevIndexNew < 0) {
        console.log('❌ No se puede retroceder más, primer paso alcanzado');
        return prevIndex;
      }
      console.log('✅ Retrocediendo al paso:', prevIndexNew + 1, steps[prevIndexNew].label);
      return prevIndexNew;
    });
  }, []);
  const goToStep = useCallback(index => {
    console.log('🎯 Ejecutando goToStep...', index);
    if (index >= 0 && index < steps.length) {
      console.log('✅ Yendo al paso:', index + 1, steps[index].label);
      setActiveIndex(index);
    } else {
      console.log('❌ Índice inválido:', index);
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