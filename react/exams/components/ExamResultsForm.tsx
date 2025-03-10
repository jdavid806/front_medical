import React, { useEffect, useRef, useState } from 'react';
import { useExam } from '../hooks/useExam';
import { DynamicForm } from '../../components/dynamic-form/DynamicForm';

interface ExamResultsFormProps {
    examId: string;
}

export const ExamResultsForm: React.FC<ExamResultsFormProps> = ({ examId }) => {

    const { exam, fetchExam } = useExam()
    const [formConfig, setFormConfig] = useState<any | null>()
    const dynamicFormRef = useRef<any>(null);

    useEffect(() => {
        fetchExam(examId)
    }, [examId])

    useEffect(() => {
        setFormConfig(exam?.exam_type?.form_config)
    }, [exam])

    const handleGetFormValues = () => {
        if (dynamicFormRef.current) {
            console.log(dynamicFormRef.current.getFormValues());

            return dynamicFormRef.current.getFormValues();
        }
        return null
    };

    return (
        <>
            <DynamicForm
                ref={dynamicFormRef}
                form={formConfig}>
            </DynamicForm>
            <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => handleGetFormValues()}>
                    Guardar
                </button>
            </div>
        </>
    );
};
