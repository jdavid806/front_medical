import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { ExamRecipeDto } from '../../models/models';
import { examRecipeService } from '../../../services/api';

export const usePatientExamRecipes = () => {
    const [patientExamRecipes, setPatientExamRecipes] = useState<ExamRecipeDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPatientExamRecipes = async (patientId: string) => {
        try {
            let data: ExamRecipeDto[] = await examRecipeService.pendingOfPatient(patientId);

            const mappedData = data.map((item) => {
                return {
                    ...item,
                    label: item.details.map(detail => detail.exam_type.name).join(', '),
                };
            });

            setPatientExamRecipes(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        patientExamRecipes,
        setPatientExamRecipes,
        fetchPatientExamRecipes,
        loading
    };
};
