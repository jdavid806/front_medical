import { useState, useEffect } from 'react';
import { examOrderService, examOrderStateService, examTypeService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { ExamOrderDto, ExamOrderStateDto, ExamTypeDto } from '../../models/models';

export const useExams = (patientId: string) => {
    const [exams, setExams] = useState<ExamOrderDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExams = async (patientId: string) => {
        if (!patientId) {
            return;
        }
        try {
            const [dataPromise, examTypesPromise, examStatesPromise]: [Promise<ExamOrderDto[]>, Promise<ExamTypeDto[]>, Promise<ExamOrderStateDto[]>] = [
                examOrderService.getAll(),
                examTypeService.getAll(),
                examOrderStateService.getAll(),
            ];
            let [data, examTypes, examStates] = await Promise.all([
                dataPromise,
                examTypesPromise,
                examStatesPromise,
            ]);


            data = data.filter(item => {
                return item.is_active && item.patient_id == patientId
            }).map(exam => {
                return {
                    ...exam,
                    exam_type: examTypes.find(type => type.id == exam.exam_type_id),
                    exam_order_state: examStates.find(state => state.id == exam.exam_order_state_id)
                }
            });
            setExams(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams(patientId);
    }, [patientId]);

    return {
        exams,
        fetchExams,
        loading
    };
};

