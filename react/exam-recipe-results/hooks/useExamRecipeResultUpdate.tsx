import React, { useState } from 'react';
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { examRecipeResultService } from '../../../services/api';
import { ExamRecipeResultFormInputs } from '../../clinical-records/AddParaclinicalForm';

export const useExamRecipeResultUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateExamRecipeResult = async (id: string, data: Partial<ExamRecipeResultFormInputs>) => {
        setLoading(true);
        try {
            const response = await examRecipeResultService.update(id, data);
            SwalManager.success();
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateExamRecipeResult,
        loading
    };
};