import { Password } from "primereact/password";
import React from "react";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useVerifySupervisor } from "./hooks/useVerifySupervisor";
import { VerifySupervisorFormMapper } from "./mappers";

export type VerifySupervisorFormInputs = {
    password: string
}

export type VerifySupervisorFormData = {
    external_id: string
    password: string
}

export type VerifySupervisorFormProps = {
    onVerify: (result: boolean) => void
}

export const VerifySupervisorForm: React.FC<VerifySupervisorFormProps> = ({ onVerify }) => {

    const { verifySupervisor } = useVerifySupervisor();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<VerifySupervisorFormInputs>()

    const onSubmit: SubmitHandler<VerifySupervisorFormInputs> = (data) => onHandleSubmit(data)

    const onHandleSubmit: SubmitHandler<VerifySupervisorFormInputs> = async (data) => {
        try {
            const formData = VerifySupervisorFormMapper.toFormData(data)
            const result = await verifySupervisor(formData)

            if (result.status === 401) {
                onVerify(false)
                return;
            }

            onVerify(true)

        } catch (error) {
            onVerify(false)
            console.error(error);
        }
    }

    const getFormError = (field: keyof VerifySupervisorFormInputs) => {
        const error = errors[field]?.message;
        return error && <p className="text-danger">{error}</p>
    }

    return (
        <div>
            <p>Se requiere la verificación de la identidad del supervisor. Por favor, ingrese la contraseña del supervisor</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <Controller
                        name='password'
                        control={control}
                        rules={{
                            required: {
                                value: true,
                                message: "El campo es requerido"
                            }
                        }}
                        render={({ field }) =>
                            <>
                                <label htmlFor={field.name} className="form-label">Contraseña</label>
                                <Password
                                    id={field.name}
                                    placeholder="Ingrese su contraseña"
                                    toggleMask
                                    className="w-100"
                                    inputClassName="w-100"
                                    {...field}
                                />
                            </>
                        }
                    />
                    {getFormError("password")}
                </div>
                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Verificar</button>
                </div>
            </form>
        </div>
    );
};