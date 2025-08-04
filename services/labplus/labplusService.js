import { admissionService, appointmentService, inventoryService, productService } from "../api/index.js";

class LabplusService {

    apiPrefix = 'https://api-integracion.labplusonline.com.do/api/integration/laboratorio/';

    async makeRequest({ url, method, data = null }) {
        const response = await fetch(this.apiPrefix + url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwianRpIjoiNjljMTQ2YzItNTJjNS00YTcxLWIzNjAtYTgzZTk0YTI0OTZmIiwiaWF0IjoxNzUxNjQxMDAyLCJyb2wiOlsiYXBpX2FjY2VzcyIsImFwaV9hY2Nlc3MiXSwiaWQiOlsiMSIsIjEiXSwiQXBwSWQiOiJDRU5PREUiLCJBcGlVcmwiOiJodHRwczovL2Nlbm9kZS5sYWJwbHVzb25saW5lLmNvbS5kby8iLCJBcHBVcmwiOiJodHRwczovL2Nlbm9kZS5sYWJwbHVzb25saW5lLmNvbS5kby8iLCJQcnVlYmFzQ29udHJvbGFkYXMiOiJUcnVlIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IjEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiSW50ZWdyYWNpb24uUG9zdC5PcmRlbiIsIkludGVncmFjaW9uLlBvc3QuQW51bGFyIiwiSW50ZWdyYWNpb24uT2J0ZW5lci5SZXN1bHRhZG8iLCJJbnRlZ3JhY2lvbi5PYnRlbmVyLlJlc3VsdGFkby5BcmNoaXZvcyIsIkludGVncmFjaW9uLlNlbmQuUmVzdWx0Il0sIm5iZiI6MTc1MTY0MTAwMiwiZXhwIjoxNzUxNjQ4MjAyLCJpc3MiOiJCc2FFcnBBcGkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQ0Mzk1In0.7I_voxo-COBGJef7l4kgY81Vj2xVfZjvP_BZVUOId4Q`
            },
            body: data ? JSON.stringify(data) : null,
        })

        const responseData = await response.json();

        console.log(responseData);

        return responseData;
    }

    async createAndUpdateLaboratoryOrder(data = {
        numero_orden,
        numero_admision,
        fecha,
        embarazada,
        paciente: {
            codigo_tipo_identificacion,
            identificacion,
            nombres,
            apellidos,
            direccion,
            correo_electronico,
            fecha_nacimiento,
            codigo_sexo,
            codigo_tipo_paciente,
            codigo_nacionalidad,
            Convenio
        },
        sucursal: {
            codigo
        },
        analiticas
    }) {
        return await this.makeRequest({ url: 'PostIntegrationOrden', method: 'POST', data: [data] });
    }

    async cancelOrder(data = { numero_orden }) {
        return await this.makeRequest({ url: 'PostAnularIntegrationOrden', method: 'POST', data: [data] });
    }

    async getOrderPDF(data = { numero_orden }) {
        return await this.makeRequest({ url: `ObtenerResultadoArchivos?NumeroOrden=${data.numero_orden}`, method: 'GET' });
    }

    async createAndUpdateLaboratoryOrderByAdmissionId({ admissionId }) {
        const admission = await admissionService.getAdmissionById(admissionId);

        const appointmentPromise = appointmentService.get(admission.appointment_id);
        const productsPromise = inventoryService.getServices();

        const [appointment, products] = await Promise.all([appointmentPromise, productsPromise]);

        const laboratoryServices = [
            ...products.filter(product => product.description === 'Laboratorio').splice(0, 2),
            ...products.filter(product => product.description === 'Laboratorio').splice(50, 10)
        ]

        console.log("Admision: ", admission);
        console.log("Appointment: ", appointment);
        console.log("Laboratory Services: ", laboratoryServices);

        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Fuerza formato 24h
        });

        const data = {
            numero_orden: admission.id, //
            numero_admision: admission.id, //
            fecha: currentDateString, //
            embarazada: false, //
            paciente: {
                codigo_tipo_identificacion: LabplusHelper.getDocumentTypeCode(admission.patient),
                identificacion: admission.patient.document_number, //
                nombres: admission.patient.first_name + ' ' + admission.patient.middle_name, //
                apellidos: admission.patient.last_name + ' ' + admission.patient.second_last_name, //
                direccion: admission.patient.address, //
                correo_electronico: admission.patient.email, //
                numero_afiliado: "",
                numero_historia: "",
                fecha_nacimiento: admission.patient.date_of_birth, //
                codigo_convenio: admission.id,
                codigo_plan: "",
                codigo_sexo: LabplusHelper.getGenderCode(admission.patient.gender), //
                codigo_tipo_paciente: LabplusHelper.getPatientTypeCode(admission.patient), //
                codigo_tipo_sangre: "",
                codigo_municipio: "",
                codigo_nacionalidad: LabplusHelper.getNationalityCode(admission.patient), //
                Convenio: admission.patient.social_security.entity.name //
            },
            sucursal: {
                codigo: "1", //
                nombre: "Centro Oriental de Diabetes y Endocrinología" //
            }, //
            "medico": {
                "codigo": appointment.user_availability.user.clinical_record, //
                "nombres": `${appointment.user_availability.user.first_name} ${appointment.user_availability.user.middle_name}`, //
                "apellidos": `${appointment.user_availability.user.last_name} ${appointment.user_availability.user.second_last_name}`, //
                "especialidad": appointment.user_availability.user.specialty.name, //
                "email": appointment.user_availability.user.email //
            }, //
            analiticas: laboratoryServices.map(laboratoryService => ({
                descripcion: laboratoryService.name, //
                codigo: laboratoryService.barcode //
            })) //
        };

        console.log("Data: ", data);

        return await this.makeRequest({ url: 'PostIntegrationOrden', method: 'POST', data: [data] });
    }
}

class LabplusHelper {
    static getGenderCode(gender) {
        switch (gender) {
            case 'MALE':
                return "M";
            case 'FEMALE':
                return "F";
            default:
                return "I";
        }
    }

    static getPatientTypeCode(patientType) {
        return "A"
    }

    static getNationalityCode(nationality) {
        return "1"
    }

    static getDocumentTypeCode(documentType) {
        return "2"
    }
}

export const labplusService = new LabplusService();