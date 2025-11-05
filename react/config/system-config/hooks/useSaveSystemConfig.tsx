import { useState } from "react";
import { SystemConfigData } from "../interfaces";
import { usePRToast } from "../../../hooks/usePRToast";
import SystemConfigService from "../../../../services/api/classes/systemConfigService";

export const useSaveSystemConfig = () => {

    const { showServerErrorsToast, showSuccessToast, toast } = usePRToast();

    const saveSystemConfig = async (systemConfig: SystemConfigData) => {
        try {
            const service = new SystemConfigService();
            await service.storeSystemConfig({ configs: Object.entries(systemConfig).map(([key, value]) => ({ key_: key, value })) });
            showSuccessToast({
                message: "Configuración de sistema guardada exitosamente"
            });
        } catch (error) {
            console.error(error);
            showServerErrorsToast(error);
            throw error;
        }
    };

    return { saveSystemConfig, toast };
};
