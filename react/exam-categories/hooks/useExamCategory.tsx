import React, { useState } from "react";
import { ExamTypeDto } from "../../models/models";
import { examCategoryService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useExamCategory = () => {
    const [examCategory, setExamCategory] = useState<ExamTypeDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchExamCategory = async (id: string) => {
        try {
            const data = await examCategoryService.get(id);
            setExamCategory(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        examCategory,
        setExamCategory,
        fetchExamCategory,
        loading
    };
};
