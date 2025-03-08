let currentStep = 1;
const updateWizard = () => {
  document.querySelectorAll('.step').forEach(step => {
    step.classList.toggle('active', step.dataset.step == currentStep);
  });
  document.querySelectorAll('.wizard-step').forEach(step => {
    step.classList.toggle('active', step.dataset.step == currentStep);
  });
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
document.getElementById('modalNuevaFacturaCliente').addEventListener('submit', function (event) {
  if (!this.checkValidity()) {
    event.preventDefault();
    this.classList.add('was-validated');
  }
});
updateWizard();

document.addEventListener("DOMContentLoaded", () => {
  const name_form = $("#name_form").val();
  const user_role = "doctor";
  console.log("Nombre del formulario" + name_form);

  // fetch(`./Consultas/json/formConfig${name_form}.json`)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("No se pudo cargar el archivo JSON");
  //     }
  //     return response.json();
  //   })
  //   .then((config) => {
  //     generate_form(config, user_role);
  //     changeName(formName);
  //   })
  //   .catch((error) => console.error("Error al cargar el JSON:", error));
});

function generate_form(config, userRole) { 

  const modalBody = document.querySelector('.modal-body.modal-steps');
  const divChild = document.createElement('div');
  const ul = document.createElement('ul');
  const li = document.createElement('li');
  const span = document.createElement('span');

  modalBody.innerHTML = "";

  divChild.className = "steps-container mb-4";
  ul.className = "steps";

}