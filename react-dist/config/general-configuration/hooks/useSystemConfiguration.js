import { useState, useCallback, useEffect, useRef } from "react";
import { useConfigurationProgress } from "./useConfigurationProgress.js";
export const useSystemConfiguration = ({
  steps,
  initialStep = 0
}) => {
  const [activeIndex, setActiveIndex] = useState(initialStep);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const isInitializingRef = useRef(false);
  const lastSavedStepRef = useRef({
    stepId: null,
    stepIndex: null
  });
  const {
    isLoading,
    currentConfig,
    saveProgress,
    error,
    loadProgress
  } = useConfigurationProgress({
    onProgressLoaded: config => {
      if (isInitializingRef.current) return;
      isInitializingRef.current = true;

      // Extraer la configuración parseada
      const configData = config?.config_tenants || config;
      if (configData && configData.step_index !== undefined && configData.step_index !== null) {
        const savedStepIndex = configData.step_index;
        if (savedStepIndex >= 0 && savedStepIndex < steps.length) {
          // FORZAR el cambio al paso guardado
          setActiveIndex(savedStepIndex);
          setHasSavedProgress(true);
          lastSavedStepRef.current = {
            stepId: steps[savedStepIndex].id,
            stepIndex: savedStepIndex
          };
        } else {
          console.warn("❌ Índice de paso guardado inválido:", savedStepIndex);
          setActiveIndex(initialStep);
          setHasSavedProgress(false);
        }
      } else {
        setActiveIndex(initialStep);
        setHasSavedProgress(false);
      }
      setIsInitialized(true);
    }
  });

  // Cargar progreso solo una vez al montar
  useEffect(() => {
    if (!isInitialized && !isLoading) {
      loadProgress();
    }
  }, [isInitialized, isLoading, loadProgress]);

  // Guardar progreso cuando cambia el paso REALMENTE
  useEffect(() => {
    if (!isInitialized || isLoading) return;
    const currentStep = steps[activeIndex];
    const currentStepInfo = {
      stepId: currentStep.id,
      stepIndex: activeIndex
    };

    // Solo guardar si realmente cambió el paso
    if (lastSavedStepRef.current.stepId !== currentStepInfo.stepId || lastSavedStepRef.current.stepIndex !== currentStepInfo.stepIndex) {
      saveProgress(currentStep.id, activeIndex).then(() => {
        lastSavedStepRef.current = currentStepInfo;
      }).catch(console.error);
    }
  }, [activeIndex, isInitialized, isLoading, saveProgress, steps]);
  const goToNext = useCallback(() => {
    setActiveIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= steps.length) {
        return prevIndex;
      }
      return nextIndex;
    });
  }, [activeIndex, steps]);
  const goToPrevious = useCallback(() => {
    setActiveIndex(prevIndex => {
      const prevIndexNew = prevIndex - 1;
      if (prevIndexNew < 0) {
        return prevIndex;
      }
      return prevIndexNew;
    });
  }, [activeIndex, steps]);
  const goToStep = useCallback(index => {
    if (index >= 0 && index < steps.length) {
      setActiveIndex(index);
    } else {
      console.warn("❌ Índice de paso inválido:", index);
    }
  }, [steps.length, steps]);
  const resetToInitial = useCallback(() => {
    setActiveIndex(initialStep);
    setHasSavedProgress(false);
    lastSavedStepRef.current = {
      stepId: null,
      stepIndex: null
    };
  }, [initialStep]);

  // Debug: mostrar estado actual
  // useEffect(() => {
  //     if (isInitialized) {
  //         console.log('📈 Estado actual:', {
  //             activeIndex,
  //             currentStep: steps[activeIndex]?.id,
  //             hasSavedProgress,
  //             isInitialized,
  //             isLoading
  //         });
  //     }
  // }, [activeIndex, hasSavedProgress, isInitialized, isLoading, steps]);

  return {
    activeIndex,
    goToNext,
    goToPrevious,
    goToStep,
    resetToInitial,
    totalSteps: steps.length,
    currentStep: steps[activeIndex],
    isLoading: isLoading || !isInitialized,
    error,
    savedConfig: currentConfig,
    hasSavedProgress,
    isRestoredFromSave: hasSavedProgress && isInitialized && !isLoading
  };
};