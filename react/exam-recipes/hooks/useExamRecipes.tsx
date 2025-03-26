import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { ExamRecipeDto } from '../../models/models';
import { examRecipeService } from '../../../services/api';

export const useExamRecipes = (patientId: string | null) => {
    const [examRecipes, setExamRecipes] = useState<ExamRecipeDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExamRecipes = async (patientId: string) => {
        try {
            let data: ExamRecipeDto[] = await examRecipeService.ofPatient(patientId);

            setExamRecipes(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (patientId) fetchExamRecipes(patientId);
    }, [patientId]);

    return {
        examRecipes,
        fetchExamRecipes,
        loading
    };
};
