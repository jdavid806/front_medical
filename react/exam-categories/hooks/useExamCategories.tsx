import { useState, useEffect } from 'react';
import { examCategoryService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { ExamCategoryDto } from '../../models/models';

export const useExamCategories = () => {
    const [examCategories, setExamCategories] = useState<ExamCategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExamCategories = async () => {
        try {
            let data: ExamCategoryDto[] = await examCategoryService.getAll();
            data = data.filter(item => item.is_active);
            setExamCategories(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamCategories();
    }, []);

    return {
        examCategories,
        fetchExamCategories,
        loading
    };
};

