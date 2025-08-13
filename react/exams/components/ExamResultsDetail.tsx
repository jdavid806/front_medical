import React, { useEffect, useRef, useState } from 'react';
import { useExam } from '../hooks/useExam';
import { DynamicForm } from '../../components/dynamic-form/DynamicForm';

interface ExamResultsFormProps {
    examId: string;
}

export const ExamResultsDetail: React.FC<ExamResultsFormProps> = ({ examId }) => {

    const { exam, fetchExam } = useExam()
    const [formConfig, setFormConfig] = useState<any | null>()
    const [examName, setExamName] = useState<string>('Cargando...')
    const dynamicFormRef = useRef<any>(null);

    useEffect(() => {
        fetchExam(examId)
    }, [examId])

    useEffect(() => {
        if (exam) {
            setExamName(exam?.exam_type?.name || 'Ver resultados de examen')
            const result = exam?.exam_result?.results || {}
            const defaultForm = exam?.exam_type?.form_config.values || {}
            const filledForm = { ...defaultForm };

            for (const key in result) {
                if (result.hasOwnProperty(key) && filledForm.hasOwnProperty(key)) {
                    filledForm[key] = result[key];
                }
            }

            if (filledForm) {
                exam!.exam_type!.form_config.values = (exam as any).exam_result[0].results;
                setFormConfig(exam?.exam_type?.form_config)
            }
        }
    }, [exam])

    return (
        <>
            <h2>{examName}</h2>
            <DynamicForm
                ref={dynamicFormRef}
                form={formConfig}>
            </DynamicForm>
        </>
    );
};
