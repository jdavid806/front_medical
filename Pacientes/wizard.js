let currentStep = 1;

  const updateWizard = () => {
    // Actualizar los pasos visuales
    document.querySelectorAll('.step').forEach(step => {
      step.classList.toggle('active', step.dataset.step == currentStep);
    });

    // Mostrar el contenido correspondiente
    document.querySelectorAll('.wizard-step').forEach(step => {
      step.classList.toggle('active', step.dataset.step == currentStep);
    });

    // Controlar los botones
    document.getElementById('prevStep').disabled = currentStep === 1;
    document.getElementById('nextStep').classList.toggle('d-none', currentStep === 3);
    document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 3);
  };

  document.getElementById('nextStep').addEventListener('click', () => {
    const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    if (currentForm.querySelector(':invalid')) {
      currentForm.querySelector(':invalid').focus();
      currentForm.classList.add('was-validated');
    } else {
      currentStep++;
      updateWizard();
    }
  });

  document.getElementById('prevStep').addEventListener('click', () => {
    currentStep--;
    updateWizard();
  });

  document.getElementById('wizardForm').addEventListener('submit', function (event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      this.classList.add('was-validated');
    }
  });

  updateWizard();