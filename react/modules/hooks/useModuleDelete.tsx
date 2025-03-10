import { useState } from 'react';
import { moduleService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';

export const useModuleDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteModule = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await moduleService.delete(id);
                    confirmed = true
                }
            )
            return confirmed
        } catch (err) {
            ErrorHandler.generic(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteModule,
        loading
    };
};

