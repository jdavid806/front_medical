import React, { useState } from 'react';
import { examTypeService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { ExamTypeInputs } from '../components/ExamConfigForm';

export const useExamTypeUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateExamType = async (id: string, data: ExamTypeInputs) => {
        setLoading(true);
        try {
            const finalData = {
                ...data,
                form_config: (
                    Object.keys(data.form_config).length > 0
                        || data.form_config != null
                        && data.form_config != "{}"
                        ? data.form_config : { tabs: [] }
                )
            }
            await examTypeService.update(id, finalData);
            SwalManager.success();
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateExamType,
        loading
    };
};
