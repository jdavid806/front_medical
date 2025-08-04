import BaseApiService from './baseApiService.js';
import { patientService, userService } from "../index.js";

export class MSMasivaService extends BaseApiService {
    async sendMessageOnPatientCall(patientId, doctorId) {
        const patient = await patientService.get(patientId);
        const doctor = await userService.get(doctorId);
        try {
            const patientName = `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`;
            const dayOffice = doctor.availabilities.find(availability => {
                return availability.days_of_week.includes(new Date().getDay())
            })?.office
            const doctorName = `${doctor.first_name} ${doctor.middle_name} ${doctor.last_name} ${doctor.second_last_name}`
            const message = `
                *Centro Oriental de Diabetes y Endocrinologia*
                Hola *${patientName}*, te informamos que ya puedes acercarte al *consultorio #${dayOffice}*. El doctor (a) *${doctorName}* está listo para atenderte. 
                *¡Gracias por tu paciencia!*
            `
            const url = `${this.microservice}/message/send`;
            // console.log({
            //     "channel": "whatsapp",
            //     "message_type": "text",
            //     "instance_name": "Cenode",
            //     "recipients": [patient.whatsapp],
            //     message,
            //     "webhook_url": "https://hooks.medicalsoft.ai/webhook/mensajes"
            // });

            return await this.httpClient.post(
                url,
                {
                    "channel": "whatsapp",
                    "message_type": "text",
                    "instance_name": "Cenode",
                    "recipients": [patient.whatsapp],
                    message,
                    "webhook_url": "https://hooks.medicalsoft.ai/webhook/mensajes"
                },
                {
                    'Evolution-API-Key': '5B1AA17C9C35-405D-AF24-34F022A86B22'
                }
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default MSMasivaService;