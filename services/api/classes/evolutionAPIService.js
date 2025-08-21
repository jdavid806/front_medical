export class EvolutionAPIService {
    createInstance = async ({
        instanceName
    }) => {
        const response = await fetch('https://apiwhatsapp.medicalsoft.ai/instance/create', {
            body: JSON.stringify({
                instanceName,
                integration: "WHATSAPP-BAILEYS"
            }),
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'oEQ0j9ft1FX43QkGLDCEM0arw'
            },
            method: 'POST'
        })

        return await response.json()
    }
}