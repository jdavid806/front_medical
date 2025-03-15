/**
 * Función global para manejar un asistente (wizard) de pasos múltiples
 * @param {Object} config - Configuración del wizard
 * @param {string} config.stepsSelector - Selector CSS para los indicadores de pasos
 * @param {string} config.contentSelector - Selector CSS para los contenidos de cada paso
 * @param {string} config.prevButtonId - ID del botón para ir al paso anterior
 * @param {string} config.nextButtonId - ID del botón para ir al paso siguiente
 * @param {string} config.finishButtonId - ID del botón para finalizar (opcional)
 * @param {number} config.totalSteps - Número total de pasos
 * @param {number} config.initialStep - Paso inicial (por defecto: 1)
 * @param {Function} config.onStepChange - Función a ejecutar cuando cambia el paso (opcional)
 * @param {Function} config.onFinish - Función a ejecutar cuando se completa el wizard (opcional)
 * @returns {Object} - Objeto con métodos para controlar el wizard
 */
function createWizard(config) {
    // Configuración por defecto
    const settings = {
        stepsSelector: '.step',
        contentSelector: '.wizard-step',
        prevButtonId: 'prevStep',
        nextButtonId: 'nextStep',
        finishButtonId: 'finishStep',
        totalSteps: 2,
        initialStep: 1,
        onStepChange: null,
        onFinish: null,
        ...config
    };

    // Estado interno
    let currentStep = settings.initialStep;

    // Elementos del DOM
    const prevButton = document.getElementById(settings.prevButtonId);
    const nextButton = document.getElementById(settings.nextButtonId);
    const finishButton = settings.finishButtonId ? document.getElementById(settings.finishButtonId) : null;

    /**
     * Actualiza la interfaz del wizard según el paso actual
     */
    const updateWizard = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll(settings.stepsSelector).forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll(settings.contentSelector).forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStep);
        });

        // Controlar el botón de paso anterior
        if (prevButton) {
            prevButton.disabled = currentStep === 1;
        }

        // Controlar botones de siguiente y finalizar
        if (nextButton && finishButton) {
            const isLastStep = currentStep === settings.totalSteps;
            nextButton.classList.toggle('d-none', isLastStep);
            finishButton.classList.toggle('d-none', !isLastStep);
        }

        // Ejecutar callback si existe
        if (typeof settings.onStepChange === 'function') {
            settings.onStepChange(currentStep);
        }
    };

    /**
     * Configura los listeners para los botones
     */
    const setupListeners = () => {
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const currentContent = document.querySelector(`${settings.contentSelector}[data-step="${currentStep}"]`);
                
                // Verificar validación si el contenido existe
                if (currentContent) {
                    const invalidField = currentContent.querySelector(':invalid');
                    if (invalidField) {
                        invalidField.focus();
                        currentContent.classList.add('was-validated');
                        return;
                    }
                }
                
                // Avanzar al siguiente paso
                if (currentStep < settings.totalSteps) {
                    currentStep++;
                    updateWizard();
                }
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateWizard();
                }
            });
        }

        if (finishButton) {
            finishButton.addEventListener('click', () => {
                const currentContent = document.querySelector(`${settings.contentSelector}[data-step="${currentStep}"]`);
                
                // Verificar validación si el contenido existe
                if (currentContent) {
                    const invalidField = currentContent.querySelector(':invalid');
                    if (invalidField) {
                        invalidField.focus();
                        currentContent.classList.add('was-validated');
                        return;
                    }
                }
                
                // Ejecutar callback de finalización si existe
                if (typeof settings.onFinish === 'function') {
                    settings.onFinish();
                }
            });
        }
    };

    // API pública
    const wizardAPI = {
        /**
         * Inicializa el wizard
         */
        init: () => {
            setupListeners();
            updateWizard();
            return wizardAPI;
        },
        
        /**
         * Avanza al siguiente paso si es posible
         */
        next: () => {
            if (currentStep < settings.totalSteps) {
                currentStep++;
                updateWizard();
            }
            return wizardAPI;
        },
        
        /**
         * Retrocede al paso anterior si es posible
         */
        prev: () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizard();
            }
            return wizardAPI;
        },
        
        /**
         * Va a un paso específico
         * @param {number} step - Número de paso al que ir
         */
        goToStep: (step) => {
            if (step >= 1 && step <= settings.totalSteps) {
                currentStep = step;
                updateWizard();
            }
            return wizardAPI;
        },
        
        /**
         * Devuelve el paso actual
         */
        getCurrentStep: () => currentStep
    };

    return wizardAPI;
}