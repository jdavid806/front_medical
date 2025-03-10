import { useState } from 'react';
import { examTypeService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { SwalManager } from '../../../services/alertManagerImported.js';

export const useExamTypeDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteExamType = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await examTypeService.delete(id);
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
        deleteExamType,
        loading
    };
};
