import React from 'react';
import { CustomFormModal } from '../components/CustomFormModal';
import { AddParaclinicalForm, ExamRecipeResultFormInputs } from './AddParaclinicalForm';
import { useState } from 'react';
import { userService } from '../../services/api';
import { useExamRecipeResultCreate } from '../exam-recipe-results/hooks/useExamRecipeResultCreate';
import { useExamRecipeResultUpdate } from '../exam-recipe-results/hooks/useExamRecipeResultUpdate';
import { validFile } from '../../services/utilidades';

export const AddParaclinicalButton: React.FC = () => {

    const [showAddParaclinicalFormModal, setShowAddParaclinicalFormModal] = useState(false);
    const { createExamRecipeResult } = useExamRecipeResultCreate();
    const { updateExamRecipeResult } = useExamRecipeResultUpdate();

    const handleSubmit = async (data: ExamRecipeResultFormInputs) => {

        if (!validFile("addParaclinicalFormFile")) { return };

        const currentUser = await userService.getLoggedUser();

        const finalData: any = {
            exam_recipe_id: data.exam_recipe_id,
            date: data.date?.toISOString().split('T')[0],
            comment: data.comment,
            uploaded_by_user_id: currentUser.id
        }

        try {
            const res = await createExamRecipeResult(finalData);
            //@ts-ignore
            let minioUrl = await guardarResultadoRecetaExamen("addParaclinicalFormFile", res.id);
            await updateExamRecipeResult(res.id, {
                result_minio_url: minioUrl,
            })
            setShowAddParaclinicalFormModal(false)
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={() => setShowAddParaclinicalFormModal(true)}>
                <i className="fas fa-plus"></i> Agregar resultados
            </button>
            <CustomFormModal
                formId='createParaclinical'
                show={showAddParaclinicalFormModal}
                title='Agregar paraclínico'
                onHide={() => setShowAddParaclinicalFormModal(false)}
            >
                <AddParaclinicalForm
                    formId='createParaclinical'
                    onHandleSubmit={handleSubmit}
                >
                </AddParaclinicalForm>
            </CustomFormModal>
        </div>
    );
};

