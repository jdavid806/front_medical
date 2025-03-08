import AlertManager from "../../services/alertManager.js";
import { patientService } from "../../services/api/index.js";

// Variable para almacenar los datos del acompañante temporalmente
let companionsTemp = [];

document.getElementById('finishStep').addEventListener('click', function () {
    const form = document.getElementById('formNuevoPaciente');
    const formData = new FormData(form);
    
    const data = {
        companions: [],
        social_security: {},
        patient: {}
    };

    formData.forEach((value, key) => {
        const keys = key.split('[').map(k => k.replace(']', ''));
        if (keys[0] === 'companions') {
            const index = parseInt(keys[1], 10);
            if (!data.companions[index]) {
                data.companions[index] = {};
            }
            data.companions[index][keys[2]] = value;
        } else if (keys[0] === 'social_security') {
            data.social_security[keys[1]] = value;
        } else if (keys[0] === 'patient') {
            data.patient[keys[1]] = value;
        }
    });

    // Asegurar que companionsTemp tenga la estructura correcta y convertir valores
    data.companions = companionsTemp.map(companion => ({
        document_type: companion.typeDocument,
        document_number: parseInt(companion.numberIdentification, 10) || null,
        first_name: companion.firstName,
        middle_name: companion.secondName || null,
        last_name: companion.lastName,
        second_last_name: companion.secondLastName || null,
        email: companion.email,
        mobile: companion.whatsapp,
        is_active: companion.is_active === "true" || companion.is_active === true, // Asegurar booleano
        relationship: companion.relationship
    }));

    // Convertir ciertos valores a números si existen
    if (data.patient.country_id) {
        data.patient.country_id = parseInt(data.patient.country_id, 10);
    }
    if (data.patient.department_id) {
        data.patient.department_id = parseInt(data.patient.department_id, 10);
    }
    if (data.patient.city_id) {
        data.patient.city_id = parseInt(data.patient.city_id, 10);
    }

    console.log("Datos a enviar:", data);

    patientService.storePatient(data)
        .then(() => {
            AlertManager.success({
                text: 'Se ha creado el registro exitosamente'
            });

            setTimeout(() => {
                const modal = document.getElementById('modalCrearPaciente');
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();

                window.location.reload();
            }, 4000);
        })
        .catch(err => {
            if (err.data?.errors) {
                AlertManager.formErrors(err.data.errors);
            } else {
                AlertManager.error({
                    text: err.message || 'Ocurrió un error inesperado'
                });
            }
        });
});

document.getElementById('saveCompanionButton').addEventListener('click', function () {
    const companionForm = document.getElementById('partnerForm');
    const companionFormData = new FormData(companionForm);
    const companionData = {};

    companionFormData.forEach((value, key) => {
        companionData[key] = value;
    });

    // Almacenar los datos temporalmente con la estructura correcta
    companionsTemp.push({
        typeDocument: companionData.document_type,
        numberIdentification: parseInt(companionData.document_number, 10) || null,
        firstName: companionData.first_name,
        lastName: companionData.last_name,
        email: companionData.email,
        whatsapp: companionData.mobile,
        is_active: companionData.is_active === "true" || companionData.is_active === true, // Asegurar booleano
        relationship: companionData.relationship
    });

    console.log('Companion Data', companionData);
    console.log('Companions Temp', companionsTemp);

    // Cerrar el modal de crear acompañante
    const createCompanionModal = bootstrap.Modal.getInstance(document.getElementById('newPartnerModal'));
    createCompanionModal.hide();
});


