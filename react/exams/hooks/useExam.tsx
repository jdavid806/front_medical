import React, { useState } from "react";
import { ExamOrderDto } from "../../models/models";
import { examOrderService, examTypeService } from "../../../services/api";
import { ErrorHandler } from "../../../services/errorHandler";

export const useExam = () => {
    const [exam, setExam] = useState<ExamOrderDto | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchExam = async (id: string) => {
        try {
            let data: ExamOrderDto = await examOrderService.get(id);
            const examType = await examTypeService.get(data.exam_type_id);
            data.exam_type = examType;

            setExam(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        exam,
        setExam,
        fetchExam,
        loading
    };
};
