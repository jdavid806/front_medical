import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect';
import { useEffect } from 'react';
import { admissionService } from '../../services/api';
import { SwalManager } from '../../services/alertManagerImported';

export type UpdateAdmissionAuthorizationFormInputs = {
    authorization_number: string
    entity_authorized_amount: number
}

interface UpdateAdmissionAuthorizationFormProps {
    formId: string;
    admissionId: string;
}

export const UpdateAdmissionAuthorizationForm: React.FC<UpdateAdmissionAuthorizationFormProps> = ({ formId, admissionId }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<UpdateAdmissionAuthorizationFormInputs>({
        defaultValues: {
            authorization_number: '',
            entity_authorized_amount: 0,
        }
    })
    const onSubmit: SubmitHandler<UpdateAdmissionAuthorizationFormInputs> = (data) => onHandleSubmit(data)

    const getFormErrorMessage = (name: keyof UpdateAdmissionAuthorizationFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const onHandleSubmit = async (data: UpdateAdmissionAuthorizationFormInputs) => {

        try {

            const response = await admissionService.update(admissionId, data);

            console.log(response);

            SwalManager.success({
                title: 'Actualización exitosa',
                text: 'La autorización fue actualizada correctamente.'
            });

        } catch (error) {

            console.error(error);

            SwalManager.error({
                title: 'Error',
                text: 'No se pudo actualizar la autorización.'
            });
        }
    }

    useEffect(() => {
        const asyncScope = async () => {
            const admission = await admissionService.get(admissionId);

            reset({
                authorization_number: admission.authorization_number,
                entity_authorized_amount: admission.entity_authorized_amount,
            });
        };
        asyncScope();
    }, [admissionId, reset]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="authorizationNumber" className="form-label">Número de autorización</label>
                    <Controller
                        name="authorization_number"
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <input
                                type="text"
                                className={classNames('form-control', { 'p-invalid': errors.authorization_number })}
                                id="authorizationNumber"
                                placeholder="Número de autorización"
                                {...field} />
                        )}
                    />
                    {getFormErrorMessage('authorization_number')}
                </div>
                <div className="mb-3">
                    <label htmlFor="entityAuthorizedAmount" className="form-label">Monto autorizado</label>
                    <Controller
                        name="entity_authorized_amount"
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <input
                                type="number"
                                className={classNames('form-control', { 'p-invalid': errors.entity_authorized_amount })}
                                id="entityAuthorizedAmount"
                                placeholder="Monto autorizado"
                                {...field}
                            />
                        )}
                    />
                    {getFormErrorMessage('entity_authorized_amount')}
                </div>
            </form>
        </div>
    );
};