import BaseApiService from "./baseApiService";

export class PatientMockService extends BaseApiService {
    async activeCount() {
        return Promise.resolve(9);
    }

    async evolution(id) {
        return Promise.resolve([
            {
                "created_at": "2025-02-13T21:53:05.000000Z",
                "title": "Se creó una historia clínica de tipo: tipo examen 4",
                "content": "Aquí irían las observaciones"
            },
            {
                "created_at": "2025-02-13T22:08:45.000000Z",
                "title": "Se creó una incapacidad",
                "content": "Fractura de brazo"
            },
            {
                "created_at": "2025-02-13T22:10:42.000000Z",
                "title": "Se creó una nota de evolución",
                "content": "Paciente en evolución favorable, sin complicaciones. Refiere mejoría en los síntomas. Se mantiene tratamiento y monitoreo según protocolo."
            },
            {
                "created_at": "2025-02-13T22:11:38.000000Z",
                "title": "Se creó una nota de enfermería",
                "content": "Paciente estable, sin signos de alarma. Se administra medicación según indicación médica. Se recomienda continuar monitoreo y asegurar hidratación adecuada."
            },
            {
                "created_at": "2025-02-13T22:30:32.000000Z",
                "title": "Se realizó un examen",
                "content": "Aquí irían las observaciones"
            }
        ]);
    }
}
