import React from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { EvolutionAPIService } from '../../../services/api/classes/evolutionAPIService';

export const useCreateEAInstance = () => {

    const createEAInstance = async (instanceName: string) => {
        try {
            const eaService = new EvolutionAPIService();
            const response = await eaService.createInstance({ instanceName });
            return response
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        }
    }

    return {
        createEAInstance
    };
};