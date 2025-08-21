import { ErrorHandler } from "../../../services/errorHandler.js";
import { EvolutionAPIService } from "../../../services/api/classes/evolutionAPIService.js";
export const useCreateEAInstance = () => {
  const createEAInstance = async instanceName => {
    try {
      const eaService = new EvolutionAPIService();
      const response = await eaService.createInstance({
        instanceName
      });
      return response;
    } catch (error) {
      console.log(error);
      ErrorHandler.generic(error);
      throw error;
    }
  };
  return {
    createEAInstance
  };
};