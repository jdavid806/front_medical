import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useCountries } from '../countries/hooks/useCountries';
import { useCities } from '../cities/hooks/useCities';
import { genders } from '../../services/commons';
import { useRoles } from '../user-roles/hooks/useUserRoles';
import { useUserSpecialties } from '../user-specialties/hooks/useUserSpecialties';
import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';

export type UserFormInputs = {
    username: string;
    email: string;
    password: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    second_last_name: string;
    user_role_id: number;
    user_specialty_id: number;
    country_id: number;
    city_id: number;
    gender: string;
    address: string;
    phone: string;
}

interface UserFormProps {
    formId: string;
    onHandleSubmit: (data: UserFormInputs) => void;
    initialData?: UserFormInputs;
}

const UserForm: React.FC<UserFormProps> = ({ formId, onHandleSubmit, initialData }) => {

    const [selectedRole, setSelectedRole] = useState<any>(null);
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<UserFormInputs>({
        defaultValues: initialData || {
            username: '',
            email: '',
            password: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            second_last_name: '',
            user_role_id: 0,
            user_specialty_id: 0,
            country_id: 0,
            city_id: 0,
            gender: '',
            address: '',
            phone: '',
        }
    });

    const onSubmit: SubmitHandler<UserFormInputs> = (data) => onHandleSubmit(data);

    const getFormErrorMessage = (name: keyof UserFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    useEffect(() => {
        reset(initialData || {
            username: '',
            email: '',
            password: '',
            first_name: '',
            middle_name: '',
            last_name: '',
            second_last_name: '',
            user_role_id: 0,
            user_specialty_id: 0,
            country_id: 0,
            city_id: 0,
            gender: '',
            address: '',
            phone: '',
        });
    }, [initialData, reset]);

    const { countries } = useCountries();
    const { cities } = useCities();
    const { userRoles } = useRoles();
    const { userSpecialties } = useUserSpecialties();
    const gendersForSelect = Object.entries(genders).map(([value, label]) => ({ value, label }))

    const watchUserRoleId = watch('user_role_id');

    useEffect(() => {
        if (watchUserRoleId) {
            const role = userRoles.find((role: any) => role.id === watchUserRoleId);
            setSelectedRole(role);
        } else {
            setSelectedRole(null);
        }
    }, [watchUserRoleId, userRoles]);

    const passwordHeader = <div className="font-bold mb-3">Escribe una contraseña</div>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Sugerencias</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>Al menos una minúscula</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un número</li>
                <li>Mínimo 8 caracteres</li>
            </ul>
        </>
    );

    return (
        <>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div className="card mb-2">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name="first_name"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Primer nombre <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Primer nombre"
                                                className={classNames('w-100', { 'p-invalid': errors.first_name })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('first_name')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name="middle_name"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Segundo nombre</label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Segundo nombre"
                                                className='w-100'
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('middle_name')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name="last_name"
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Primer apellido <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Primer apellido"
                                                className={classNames('w-100', { 'p-invalid': errors.last_name })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('last_name')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name="second_last_name"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Segundo apellido</label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Segundo apellido"
                                                className='w-100'
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('second_last_name')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='country_id'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">País <span className="text-primary">*</span></label>
                                            <Dropdown
                                                inputId={field.name}
                                                filter
                                                options={countries}
                                                optionLabel='name'
                                                optionValue='name'
                                                placeholder="Seleccione un país"
                                                className={classNames('w-100', { 'p-invalid': errors.country_id })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('country_id')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='city_id'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Ciudad <span className="text-primary">*</span></label>
                                            <Dropdown
                                                inputId={field.name}
                                                filter
                                                options={cities}
                                                optionLabel='name'
                                                optionValue='name'
                                                placeholder="Seleccione una ciudad"
                                                className={classNames('w-100', { 'p-invalid': errors.city_id })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('city_id')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='gender'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Género <span className="text-primary">*</span></label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={gendersForSelect}
                                                optionLabel='label'
                                                optionValue='value'
                                                placeholder="Seleccione un género"
                                                className={classNames('w-100', { 'p-invalid': errors.gender })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('gender')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='address'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Dirección <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Dirección"
                                                className={classNames('w-100', { 'p-invalid': errors.address })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('address')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='phone'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Teléfono <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Teléfono"
                                                className={classNames('w-100', { 'p-invalid': errors.phone })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('phone')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo inválido' } }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Correo <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Correo"
                                                className={classNames('w-100', { 'p-invalid': errors.email })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('email')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mb-2">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='user_role_id'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Rol <span className="text-primary">*</span></label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={userRoles}
                                                optionLabel='name'
                                                optionValue='id'
                                                placeholder="Seleccione un rol"
                                                className={classNames('w-100', { 'p-invalid': errors.user_role_id })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('user_role_id')}
                            </div>
                            {selectedRole && selectedRole.group === 'DOCTOR' && (
                                <div className="col-md-6 mb-1">
                                    <Controller
                                        name='user_specialty_id'
                                        control={control}
                                        rules={{ required: 'Este campo es requerido' }}
                                        render={({ field }) => (
                                            <>
                                                <label htmlFor={field.name} className="form-label">Especialidad <span className="text-primary">*</span></label>
                                                <Dropdown
                                                    inputId={field.name}
                                                    options={userSpecialties}
                                                    optionLabel='name'
                                                    optionValue='id'
                                                    placeholder="Seleccione una especialidad"
                                                    className={classNames('w-100', { 'p-invalid': errors.user_specialty_id })}
                                                    {...field}
                                                />
                                            </>
                                        )}
                                    />
                                    {getFormErrorMessage('user_specialty_id')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='username'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Username <span className="text-primary">*</span></label>
                                            <InputText
                                                id={field.name}
                                                placeholder="Username"
                                                className={classNames('w-100', { 'p-invalid': errors.username })}
                                                {...field}
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('username')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='password'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">Contraseña <span className="text-primary">*</span></label>
                                            <Password
                                                {...field}
                                                header={passwordHeader}
                                                footer={passwordFooter}
                                                mediumLabel='Medio'
                                                strongLabel='Fuerte'
                                                weakLabel='Débil'
                                                className='w-100'
                                                inputClassName='w-100'
                                            />
                                        </>
                                    )}
                                />
                                {getFormErrorMessage('password')}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default UserForm;