import React, { useState } from "react";
import { ExamTypeDto } from "../../models/models";
import { examTypeService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useExamType = () => {
    const [examType, setExamType] = useState<ExamTypeDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchExamType = async (id: string) => {
        try {
            const data = await examTypeService.get(id);
            setExamType(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        examType,
        setExamType,
        fetchExamType,
        loading
    };
};
