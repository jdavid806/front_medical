import React, { useEffect } from 'react';
import { CustomSelectContainer } from '../components/CustomSelectContainer';
import { userFormSpecialtiesSelect } from '../user-specialties/consts/userSpecialtiesConsts';
import { userFormCitiesSelect } from '../cities/consts/cityConsts';
import { userFormGendersSelect } from '../consts/genderConsts';
import { userFormRolesSelect } from '../user-roles/consts/userRolesConsts';
import { InputText } from 'primereact/inputtext';
import { useCountries } from '../countries/hooks/useCountries';
import { Dropdown } from 'primereact/dropdown';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';

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

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
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
    })
    const onSubmit: SubmitHandler<UserFormInputs> = (data) => onHandleSubmit(data)

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

    const { countries } = useCountries()

    return (
        <>
            <form id={formId} onSubmit={handleSubmit(onSubmit)}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name="first_name"
                                    control={control}
                                    render={({ field }) => (
                                        <InputText
                                            id={field.name}
                                            name={field.name}
                                            placeholder="Primer nombre"
                                            className='w-100'
                                            ref={field.ref}
                                            value={field.value}
                                            onBlur={field.onBlur}
                                            onChange={field.onChange}
                                        />
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
                                            <label htmlFor={field.name} className="form-label">
                                                Apellido <span className="text-primary">*</span>
                                            </label>
                                            <InputText
                                                id={field.name}
                                                name={field.name}
                                                placeholder="Segundo nombre"
                                                className='w-100'
                                                ref={field.ref}
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                onChange={field.onChange}
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
                                    render={({ field }) => (
                                        <>
                                            <label htmlFor={field.name} className="form-label">
                                                Apellido <span className="text-primary">*</span>
                                            </label>
                                            <InputText
                                                id={field.name}
                                                name={field.name}
                                                placeholder="Primer apellido"
                                                className='w-100'
                                                ref={field.ref}
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                onChange={field.onChange}
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
                                            <label htmlFor={field.name} className="form-label">
                                                Apellido <span className="text-primary">*</span>
                                            </label>
                                            <InputText
                                                id={field.name}
                                                name={field.name}
                                                placeholder="Segundo apellido"
                                                className='w-100'
                                                ref={field.ref}
                                                value={field.value}
                                                onBlur={field.onBlur}
                                                onChange={field.onChange}
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
                                    render={({ field }) =>
                                        <>
                                            <label htmlFor={field.name} className="form-label">País *</label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={countries}
                                                optionLabel='name'
                                                optionValue='name'
                                                filter
                                                placeholder="Seleccione un país"
                                                className={classNames('w-100', { 'p-invalid': errors.country_id })}
                                                {...field}
                                            >
                                            </Dropdown>
                                        </>
                                    }
                                />
                                {getFormErrorMessage('country_id')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <Controller
                                    name='country_id'
                                    control={control}
                                    rules={{ required: 'Este campo es requerido' }}
                                    render={({ field }) =>
                                        <>
                                            <label htmlFor={field.name} className="form-label">País *</label>
                                            <Dropdown
                                                inputId={field.name}
                                                options={countries}
                                                optionLabel='name'
                                                optionValue='name'
                                                filter
                                                placeholder="Seleccione un país"
                                                className={classNames('w-100', { 'p-invalid': errors.branch_id })}
                                                {...field}
                                            >
                                            </Dropdown>
                                        </>
                                    }
                                />
                                {getFormErrorMessage('country_id')}
                            </div>
                            <div className="col-md-6 mb-1">
                                <label
                                    className="form-label"
                                    htmlFor='address'>
                                    Lugar o dirección de atención <span className="text-primary">*</span>
                                </label>
                                <InputText
                                    id="address"
                                    name='address'
                                    placeholder="Lugar o dirección de atención"
                                    className='w-100'
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <CustomSelectContainer
                                    config={userFormGendersSelect}
                                    onChange={handleGenderChange}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Número de Contacto <span className="text-primary">*</span></label>
                                <input className="form-control" type="text" id="numeroContacto" name='phone' placeholder="Número de Contacto" required />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Correo <span className="text-primary">*</span></label>
                                <input className="form-control" type="email" id="correoContacto" name='email' placeholder="Correo" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 mb-1">
                                <CustomSelectContainer
                                    config={userFormRolesSelect}
                                    onChange={handleRoleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <div className={user.user_role_id === 3 ? 'd-block' : 'd-none'}>
                                    <CustomSelectContainer
                                        config={userFormSpecialtiesSelect}
                                        onChange={handleSpecialtyChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Username <span className="text-primary">*</span></label>
                                <input className="form-control" type="text" required id="username" name='username' placeholder="Username" />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Contraseña <span className="text-primary">*</span></label>
                                <input className="form-control" type="password" required id="password" name='password' placeholder="Contraseña" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default UserForm;