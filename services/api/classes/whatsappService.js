import BaseApiService from './baseApiService';

export class WhatsAppService extends BaseApiService {

    baseUrl = "https://apiwhatsapp.medicalsoft.ai/";

    async getCommunicationData() {
        try {
            const response = await this.httpClient.get(
                `medical/companies?include=communication`
            );
            return response;
        } catch (error) {
            console.error('Error fetching communication data:', error);
            throw error;
        }
    }

    async checkConnectionStatus(instanceName, apiKey) {
        try {
            const response = await fetch(`${this.baseUrl}instance/connect/${instanceName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    apikey: apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error checking WhatsApp connection:', error);
            throw error;
        }
    }

    async generateQRCode(instanceName, apiKey) {
        try {
            const response = await fetch(`${this.baseUrl}instance/connect/${instanceName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    apikey: apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.base64 || null;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    async disconnectWhatsApp(instanceName, apiKey) {
        try {
            const response = await fetch(`${this.baseUrl}instance/logout/${instanceName}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    apikey: apiKey,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error disconnecting WhatsApp:', error);
            throw error;
        }
    }
}

export const whatsAppService = new WhatsAppService();
