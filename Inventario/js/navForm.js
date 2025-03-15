/**
 * Wizard.js - Módulo para gestionar formularios de múltiples pasos
 * @param {Object} options - Opciones de configuración
 * @param {number} options.totalSteps - Número total de pasos del wizard
 * @param {string} options.stepSelector - Selector CSS para los indicadores de pasos
 * @param {string} options.contentSelector - Selector CSS para el contenido de cada paso
 * @param {string} options.prevButtonId - ID del botón "anterior"
 * @param {string} options.nextButtonId - ID del botón "siguiente"
 * @param {string} options.finishButtonId - ID del botón "finalizar"
 * @param {number} options.finishOnStep - En qué paso mostrar el botón de finalizar (por defecto, el último paso)
 * @param {Function} options.onStepChange - Callback que se ejecuta al cambiar de paso (recibe el paso actual)
 * @param {Function} options.onFinish - Callback que se ejecuta al hacer clic en finalizar
 */
export function initWizard(options = {}) {
    // Configuración por defecto
    const config = {
        totalSteps: 2,
        stepSelector: '.step',
        contentSelector: '.wizard-step',
        prevButtonId: 'prevStep',
        nextButtonId: 'nextStep',
        finishButtonId: 'finishStep',
        finishOnStep: null, // Por defecto será el último paso
        validateForms: true,
        onStepChange: null,
        onFinish: null,
        ...options
    };

    // Si no se especifica finishOnStep, usar el último paso
    if (config.finishOnStep === null) {
        config.finishOnStep = config.totalSteps;
    }

    // Estado interno
    let currentStep = 1;

    // Elementos DOM
    const prevButton = document.getElementById(config.prevButtonId);
    const nextButton = document.getElementById(config.nextButtonId);
    const finishButton = config.finishButtonId ? document.getElementById(config.finishButtonId) : null;

    /**
     * Actualiza la interfaz visual según el paso actual
     */
    const updateWizard = () => {
        // Actualizar los indicadores de pasos
        document.querySelectorAll(config.stepSelector).forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll(config.contentSelector).forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        // Controlar botones
        if (prevButton) {
            prevButton.disabled = currentStep === 1;
        }
        
        if (nextButton) {
            nextButton.classList.toggle('d-none', currentStep === config.finishOnStep);
        }
        
        if (finishButton) {
            finishButton.classList.toggle('d-none', currentStep !== config.finishOnStep);
        }

        // Ejecutar callback si existe
        if (typeof config.onStepChange === 'function') {
            config.onStepChange(currentStep);
        }
    };

    /**
     * Avanza al siguiente paso si el formulario actual es válido
     */
    const goToNextStep = () => {
        if (config.validateForms) {
            const currentForm = document.querySelector(`${config.contentSelector}[data-step="${currentStep}"]`);
            const invalidField = currentForm.querySelector(':invalid');
            
            if (invalidField) {
                invalidField.focus();
                currentForm.classList.add('was-validated');
                return false;
            }
        }
        
        if (currentStep < config.totalSteps) {
            currentStep++;
            updateWizard();
            return true;
        }
        
        return false;
    };

    /**
     * Retrocede al paso anterior
     */
    const goToPrevStep = () => {
        if (currentStep > 1) {
            currentStep--;
            updateWizard();
            return true;
        }
        
        return false;
    };

    /**
     * Ir a un paso específico
     * @param {number} step - Número de paso al que ir
     */
    const goToStep = (step) => {
        if (step >= 1 && step <= config.totalSteps) {
            currentStep = step;
            updateWizard();
            return true;
        }
        
        return false;
    };

    /**
     * Finalizar el wizard
     */
    const finish = () => {
        if (typeof config.onFinish === 'function') {
            config.onFinish();
        }
    };

    // Configurar event listeners
    if (nextButton) {
        nextButton.addEventListener('click', goToNextStep);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', goToPrevStep);
    }
    
    if (finishButton) {
        finishButton.addEventListener('click', finish);
    }

    // Inicializar wizard
    updateWizard();

    // Retornar API pública
    return {
        currentStep: () => currentStep,
        totalSteps: () => config.totalSteps,
        next: goToNextStep,
        prev: goToPrevStep,
        goTo: goToStep,
        finish: finish,
        update: updateWizard
    };
}