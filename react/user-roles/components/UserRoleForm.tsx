import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { menuService, permissionService } from '../../../services/api';
import { PrimeReactProvider } from 'primereact/api';

interface Menu {
    key_: string;
    name: string;
    id: number;
    is_active?: boolean;
    pivot?: {
        is_active: boolean;
    };
}

interface PermissionCategory {
    name: string;
    permissions: Permission[];
}

interface Permission {
    key_: string;
    name: string;
}

interface UserRoleFormProps {
    formId: string
    onHandleSubmit: (data: UserRoleFormInputs) => void;
    initialData?: UserRoleFormInputs;
}

export interface UserRoleFormInputs {
    name: string;
    group: string;
    permissions: string[];
    menus: Menu[]; // Cambiado a array de objetos Menu
    menuIds: number[];
}

const roleGroupOptions = [
    { label: 'Médico', value: 'DOCTOR' },
    { label: 'Administrativo', value: 'ADMIN' },
    { label: 'Asistente médico', value: 'DOCTOR_ASSISTANT' },
];

export const UserRoleForm: React.FC<UserRoleFormProps> = ({
    formId,
    onHandleSubmit,
    initialData
}) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<UserRoleFormInputs>();

    const onSubmit: SubmitHandler<UserRoleFormInputs> = (data) => {
        const submissionData: UserRoleFormInputs = {
            ...data,
            menus: allMenus.map(menu => ({
                ...menu,
                is_active: selectedMenuIds.includes(menu.id)
            })),
            menuIds: selectedMenuIds,
            permissions: selectedPermissions
        };
        onHandleSubmit(submissionData)
    }

    const [allMenus, setAllMenus] = useState<Menu[]>([]);
    const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menusData: Menu[] = await menuService.getAll();
                setAllMenus(menusData);

                const permissionsData: PermissionCategory[] = await permissionService.getAll();
                setPermissionCategories(permissionsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (initialData) {
            console.log('Initial data received:', initialData);

            reset({
                name: initialData.name,
                group: initialData.group,
            });

            // Establecer permisos seleccionados
            setSelectedPermissions(initialData.permissions || []);

            // Establecer menús seleccionados basado en is_active o pivot.is_active
            const activeMenuIds = initialData.menus
                .filter(menu => menu.is_active || menu.pivot?.is_active)
                .map(menu => menu.id);
            setSelectedMenuIds(activeMenuIds);

            console.log('Active menu IDs:', activeMenuIds);
        } else {
            reset({
                name: '',
                group: '',
            });
            setSelectedPermissions([]);
            setSelectedMenuIds([]);
        }
    }, [initialData, reset]);

    const handleMenuChange = (menuId: number, checked: boolean) => {
        setSelectedMenuIds(prev =>
            checked ? [...prev, menuId] : prev.filter(id => id !== menuId)
        );
    };

    const handlePermissionChange = (permissionKey: string, checked: boolean) => {
        setSelectedPermissions(prev =>
            checked ? [...prev, permissionKey] : prev.filter(key => key !== permissionKey)
        );
    };

    return (
        <PrimeReactProvider value={{
            appendTo: 'self',
            zIndex: {
                overlay: 100000
            }
        }}>
            <form id={formId} onSubmit={handleSubmit(onSubmit)} className="container-fluid p-3">
                <div className="form-group mb-3">
                    <label className='form-label' htmlFor="name">Nombre del Rol</label>
                    <InputText
                        id="name"
                        {...register('name', { required: 'Nombre es requerido' })}
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="form-group mb-3">
                    <label className="form-label" htmlFor="group">Grupo del Rol</label>
                    <Controller
                        name="group"
                        control={control}
                        rules={{ required: 'Grupo de rol es requerido' }}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                options={roleGroupOptions}
                                placeholder="Seleccione grupo"
                                className={`w-100 ${errors.group ? 'is-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.group && <div className="invalid-feedback">{errors.group.message}</div>}
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Menús</h5>
                            </div>
                            <div className="card-body">
                                {allMenus.map(menu => (
                                    <div key={menu.id} className="form-check form-switch mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`menu-${menu.id}`}
                                            checked={selectedMenuIds.includes(menu.id)}
                                            onChange={(e) => handleMenuChange(menu.id, e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor={`menu-${menu.id}`}>
                                            {menu.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Permisos</h5>
                            </div>
                            <div className="card-body">
                                {permissionCategories.map((category, index) => (
                                    <div key={index}>
                                        <h5>{category.name}</h5>
                                        {category.permissions.map(permission => (
                                            <div key={permission.key_} className="form-check form-switch mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={permission.key_}
                                                    checked={selectedPermissions.includes(permission.key_)}
                                                    onChange={(e) =>
                                                        handlePermissionChange(permission.key_, e.target.checked)
                                                    }
                                                />
                                                <label className="form-check-label" htmlFor={permission.key_}>
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </PrimeReactProvider>
    );
};