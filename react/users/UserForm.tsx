import React, { useState } from 'react';
import { CustomSelectContainer } from '../components/CustomSelectContainer';
import { userFormCountriesSelect } from '../countries/consts/countryConsts';
import { userFormSpecialtiesSelect } from '../user-specialties/consts/userSpecialtiesConsts';
import { userFormCitiesSelect } from '../cities/consts/cityConsts';
import { userFormGendersSelect } from '../consts/genderConsts';
import { userFormRolesSelect } from '../user-roles/consts/userRolesConsts';
import { UserDto } from '../models/models';
import { InputText } from 'primereact/inputtext';


interface UserFormProps {
    formId: string;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const UserForm: React.FC<UserFormProps> = ({ formId, handleSubmit }) => {
    const [user, setUser] = useState<UserDto>({} as UserDto);

    const handleCountriesChange = (countries: string[]) => {
        setUser({ ...user, country_id: countries[0] });
    };

    const handleCitiesChange = (cities: string[]) => {
        setUser({ ...user, city_id: cities[0] });
    };

    const handleSpecialtyChange = (specialties: string[]) => {
        setUser({ ...user, user_specialty_id: +specialties[0] });
    };

    const handleRoleChange = (roles: string[]) => {
        setUser({ ...user, user_role_id: +roles[0] });
    };

    const handleGenderChange = (genders: string[]) => {
        setUser({ ...user, gender: genders[0] });
    };

    return (
        <>
            <form id={formId} onSubmit={handleSubmit}>
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Nombre <span className="text-primary">*</span></label>
                                <InputText id="username" name='username' placeholder="Nombre" className='w-100' />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Apellido <span className="text-primary">*</span></label>
                                <InputText id="lastName" name='last_name' placeholder="Apellido" className='w-100' />
                            </div>
                            <div className="col-md-6 mb-1">
                                <CustomSelectContainer
                                    config={userFormCountriesSelect}
                                    onChange={handleCountriesChange}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <CustomSelectContainer
                                    config={userFormCitiesSelect}
                                    onChange={handleCitiesChange}
                                />
                            </div>
                            <div className="col-md-6 mb-1">
                                <label className="form-label">Lugar o dirección de atención <span className="text-primary">*</span></label>
                                <input className="form-control" type="text" id="direccionAtencion" name='address' placeholder="Lugar o dirección de atención" required />
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