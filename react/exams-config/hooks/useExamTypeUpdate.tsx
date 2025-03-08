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
            await examTypeService.update(id, data);
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
