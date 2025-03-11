import { useState, useEffect } from 'react';
import { examTypeService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { ExamTypeDto } from '../../models/models';

export const useExamTypes = () => {
    const [examTypes, setExamsTypes] = useState<ExamTypeDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExamTypes = async () => {
        try {
            let data: ExamTypeDto[] = await examTypeService.getAll();
            data = data.filter(item => item.is_active);
            console.log('Examenes', data);

            setExamsTypes(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamTypes();
    }, []);

    return {
        examTypes,
        fetchExamTypes,
        loading
    };
};

