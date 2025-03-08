const wizardInit = () => {
  const { getData } = window.phoenix.utils;

  const selectors = {
    WIZARDS: '[data-theme-wizard]',
    TOGGLE_BUTTON_EL: '[data-wizard-step]',
    FORMS: '[data-wizard-form]',
    NEXT_BTN: '[data-wizard-next-btn]',
    PREV_BTN: '[data-wizard-prev-btn]',
    FOOTER: '[data-wizard-footer]',
    CANCEL_BTN: '#cancelButton' // Selector del botón de cancelar
  };

  const events = {
    SUBMIT: 'submit',
    SHOW: 'show.bs.tab',
    SHOWN: 'shown.bs.tab',
    CLICK: 'click'
  };

  const wizards = document.querySelectorAll(selectors.WIZARDS);

  wizards.forEach(wizard => {
    const tabToggleButtonEl = wizard.querySelectorAll(selectors.TOGGLE_BUTTON_EL);
    const forms = wizard.querySelectorAll(selectors.FORMS);
    const nextButton = wizard.querySelector(selectors.NEXT_BTN);
    const prevButton = wizard.querySelector(selectors.PREV_BTN);
    const wizardFooter = wizard.querySelector(selectors.FOOTER);
    const cancelButton = wizard.querySelector(selectors.CANCEL_BTN);

    let count = 0;
    let showEvent = null;

    // Añadir evento de "Cancelar" para cerrar el wizard y mostrar la vista anterior
    if (cancelButton) {
      cancelButton.addEventListener(events.CLICK, () => {
        // Cierra el modal y vuelve al estado anterior del contenido
        const modal = document.getElementById('modalCrearCita');
        if (modal) {
          modal.classList.remove('show');
          modal.style.display = 'none';
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop').remove();
        }
      });
    }

    // Resto del código para manejar la navegación de los pasos y validación de los formularios...
    nextButton.addEventListener(events.CLICK, () => {
      if (count + 1 < tabToggleButtonEl.length) {
        tabToggleButtonEl[count + 1].show();
      }
    });

    if (prevButton) {
      prevButton.addEventListener(events.CLICK, () => {
        count -= 1;
        tabToggleButtonEl[count].show();
      });
    }

    if (tabToggleButtonEl.length) {
      tabToggleButtonEl.forEach((item, index) => {
        item.addEventListener(events.SHOW, e => {
          const step = getData(item, 'wizard-step');
          showEvent = e;
          if (step > count) {
            forms[count].dispatchEvent(new Event(events.SUBMIT, {
              bubbles: true,
              cancelable: true
            }));
          }
        });
        item.addEventListener(events.SHOWN, () => {
          count = index;
          if (count > tabToggleButtonEl.length - 2) {
            wizardFooter.classList.add('d-none');
          } else {
            wizardFooter.classList.remove('d-none');
          }
          if (prevButton) {
            if (count > 0 && count !== tabToggleButtonEl.length - 1) {
              prevButton.classList.remove('d-none');
            } else {
              prevButton.classList.add('d-none');
            }
          }
        });
      });
    }
  });
};

export default wizardInit;
