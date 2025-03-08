import React, { useState } from 'react';
import { examCategoryService } from "../../../services/api/index";
import { ErrorHandler } from "../../../services/errorHandler";
import { SwalManager } from '../../../services/alertManagerImported';
import { ExamCategoryInputs } from '../components/ExamCategoryForm';

export const useExamCategoryUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateExamCategory = async (id: string, data: ExamCategoryInputs) => {
        setLoading(true);
        try {
            await examCategoryService.update(id, data);
            SwalManager.success();
        } catch (error) {
            ErrorHandler.generic(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        updateExamCategory,
        loading
    };
};
