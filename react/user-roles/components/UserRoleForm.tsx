import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { menuService, permissionService } from '../../../services/api';
import { PrimeReactProvider } from 'primereact/api';

interface Menu {
    id: number;
    key: string;
    label: string;
    url: string | null;
    parent_id: number | null;
    icon: string;
    is_active: boolean;
    items?: Menu[];
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
    roleId?: number;
}

export interface UserRoleFormInputs {
    name: string;
    group: string;
    permissions: string[];
    menus: Menu[];
    menuIds: number[];
}

const roleGroupOptions = [
    { label: 'Médico', value: 'DOCTOR' },
    { label: 'Administrativo', value: 'ADMIN' },
    { label: 'Asistente médico', value: 'DOCTOR_ASSISTANT' },
    { label: 'Auxiliar', value: 'ASSISTANT' },
];

// Componente de acordeón recursivo - TODOS los niveles con el mismo diseño
const MenuAccordion: React.FC<{
    menus: Menu[];
    selectedMenuIds: number[];
    onMenuChange: (menuId: number, checked: boolean) => void;
    level?: number;
}> = ({ menus, selectedMenuIds, onMenuChange, level = 0 }) => {
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const toggleItem = (menuId: number) => {
        setExpandedItems(prev =>
            prev.includes(menuId)
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const hasChildren = (menu: Menu) => menu.items && menu.items.length > 0;

    const handleMenuChangeWithChildren = (menu: Menu, checked: boolean) => {
        onMenuChange(menu.id, checked);
        
        if (hasChildren(menu)) {
            const selectAllChildren = (childMenus: Menu[]) => {
                childMenus.forEach(child => {
                    onMenuChange(child.id, checked);
                    if (child.items && child.items.length > 0) {
                        selectAllChildren(child.items);
                    }
                });
            };
            selectAllChildren(menu.items!);
        }
    };

    const areAllChildrenSelected = (menu: Menu): boolean => {
        if (!hasChildren(menu)) return false;
        return menu.items!.every(child => selectedMenuIds.includes(child.id));
    };

    const areSomeChildrenSelected = (menu: Menu): boolean => {
        if (!hasChildren(menu)) return false;
        return menu.items!.some(child => selectedMenuIds.includes(child.id));
    };

    return (
        <div className="accordion">
            {menus.map(menu => {
                const isExpanded = expandedItems.includes(menu.id);
                const children = menu.items || [];
                const allChildrenSelected = areAllChildrenSelected(menu);
                const someChildrenSelected = areSomeChildrenSelected(menu);

                return (
                    <div key={menu.id} className="accordion-item border-0 mb-2">
                        {/* TODOS los niveles tienen el MISMO diseño */}
                        <div className="accordion-header bg-light p-3 rounded border">
                            <div className="d-flex align-items-center">
                                <input
                                    className="form-check-input me-3"
                                    type="checkbox"
                                    id={`menu-${menu.id}`}
                                    checked={selectedMenuIds.includes(menu.id) || allChildrenSelected}
                                    ref={input => {
                                        if (input) {
                                            input.indeterminate = someChildrenSelected && !allChildrenSelected && !selectedMenuIds.includes(menu.id);
                                        }
                                    }}
                                    onChange={(e) => handleMenuChangeWithChildren(menu, e.target.checked)}
                                />
                                <label 
                                    className="form-check-label flex-grow-1 fw-bold cursor-pointer"
                                    htmlFor={`menu-${menu.id}`}
                                    onClick={() => hasChildren(menu) && toggleItem(menu.id)}
                                    style={{ 
                                        cursor: hasChildren(menu) ? 'pointer' : 'default',
                                        color: '#2c3e50'
                                    }}
                                >
                                    {menu.label}
                                    {hasChildren(menu) && (
                                        <span className="badge bg-primary ms-2">
                                            {children.length}
                                        </span>
                                    )}
                                </label>
                                {hasChildren(menu) && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => toggleItem(menu.id)}
                                    >
                                        {isExpanded ? (
                                            <i className="fas fa-chevron-up"></i>
                                        ) : (
                                            <i className="fas fa-chevron-down"></i>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Hijos - se renderizan recursivamente con el MISMO diseño */}
                        {hasChildren(menu) && isExpanded && (
                            <div className="accordion-content mt-2 ms-3">
                                <MenuAccordion
                                    menus={children}
                                    selectedMenuIds={selectedMenuIds}
                                    onMenuChange={onMenuChange}
                                    level={level + 1}
                                />
                                
                                {/* Botones de selección rápida para esta sección */}
                                {children.length > 0 && (
                                    <div className="mt-2 mb-3">
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-sm"
                                                onClick={() => {
                                                    children.forEach(child => {
                                                        if (!selectedMenuIds.includes(child.id)) {
                                                            handleMenuChangeWithChildren(child, true);
                                                        }
                                                    });
                                                }}
                                            >
                                                <i className="fas fa-check me-1"></i> Todos
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => {
                                                    children.forEach(child => {
                                                        if (selectedMenuIds.includes(child.id)) {
                                                            onMenuChange(child.id, false);
                                                        }
                                                    });
                                                }}
                                            >
                                                <i className="fas fa-times me-1"></i> Ninguno
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const UserRoleForm: React.FC<UserRoleFormProps> = ({
    formId,
    onHandleSubmit,
    initialData,
    roleId
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
            menus: allMenus,
            menuIds: selectedMenuIds,
            permissions: selectedPermissions
        };
        onHandleSubmit(submissionData);
    }

    const [allMenus, setAllMenus] = useState<Menu[]>([]);
    const [permissionCategories, setPermissionCategories] = useState<PermissionCategory[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    // Determinar si es modo creación o edición
    const isEditMode = !!roleId;

    // Función recursiva para extraer todos los IDs de menús que tienen is_active = true
    const extractActiveMenuIds = (menus: Menu[]): number[] => {
        const activeIds: number[] = [];
        
        const traverse = (menuList: Menu[]) => {
            menuList.forEach(menu => {
                // Si el menú está activo, agregar su ID
                if (menu.is_active) {
                    activeIds.push(menu.id);
                }
                // Recorrer hijos recursivamente
                if (menu.items && menu.items.length > 0) {
                    traverse(menu.items);
                }
            });
        };
        
        traverse(menus);
        return activeIds;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                console.log("rolessssssss", roleId);
                
                // SOLO cargar menús si estamos en modo edición
                if (roleId) {
                    const menusData: Menu[] = await menuService.getAllMenuByRolePermissions(roleId);
                    console.log("Menús jerárquicos del API:", menusData);
                    
                    // Extraer los IDs de menús activos
                    const activeMenuIds = extractActiveMenuIds(menusData);
                    console.log("IDs de menús activos automáticamente seleccionados:", activeMenuIds);
                    
                    setAllMenus(menusData);
                    setSelectedMenuIds(activeMenuIds);
                } else {
                    // En modo creación, no cargar menús
                    setAllMenus([]);
                    setSelectedMenuIds([]);
                }

                // Reset del formulario con los datos correspondientes
                if (initialData) {
                    reset({
                        name: initialData.name,
                        group: initialData.group,
                    });
                    setSelectedPermissions(initialData.permissions || []);
                } else {
                    reset({
                        name: '',
                        group: '',
                    });
                    setSelectedPermissions([]);
                    setSelectedMenuIds([]);
                }

                // SOLO cargar permisos si estamos en modo edición
                if (roleId) {
                    const permissionsData: PermissionCategory[] = await permissionService.getAll();
                    setPermissionCategories(permissionsData);
                } else {
                    setPermissionCategories([]);
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [roleId, initialData, reset]);

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

    const getAllMenuIdsFromTree = (menus: Menu[]): number[] => {
        const ids: number[] = [];
        const traverse = (menuList: Menu[]) => {
            menuList.forEach(menu => {
                ids.push(menu.id);
                if (menu.items && menu.items.length > 0) {
                    traverse(menu.items);
                }
            });
        };
        traverse(menus);
        return ids;
    };

    if (loading) {
        return (
            <div className="container-fluid p-3">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando menús y permisos...</p>
                </div>
            </div>
        );
    }

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
                
                {/* SOLO MOSTRAR MENÚS Y PERMISOS EN MODO EDICIÓN */}
                {isEditMode ? (
                    <div className="row">
                        <div className="col-6">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0">Menús</h5>
                                        <small className="text-muted">
                                            {selectedMenuIds.length} de {getAllMenuIdsFromTree(allMenus).length} seleccionados
                                        </small>
                                    </div>
                                </div>
                                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {allMenus.length === 0 ? (
                                        <div className="alert alert-warning text-center">
                                            No hay menús disponibles
                                        </div>
                                    ) : (
                                        <MenuAccordion
                                            menus={allMenus}
                                            selectedMenuIds={selectedMenuIds}
                                            onMenuChange={handleMenuChange}
                                        />
                                    )}
                                    
                                    <div className="mt-4 border-top pt-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small className="text-muted">Selección global:</small>
                                            <div className="btn-group btn-group-sm">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-success"
                                                    onClick={() => {
                                                        const allIds = getAllMenuIdsFromTree(allMenus);
                                                        setSelectedMenuIds(allIds);
                                                    }}
                                                >
                                                    <i className="fas fa-check-double me-1"></i> Todos
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-danger"
                                                    onClick={() => setSelectedMenuIds([])}
                                                >
                                                    <i className="fas fa-times me-1"></i> Ninguno
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="mb-0">Permisos</h5>
                                </div>
                                <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                                    {permissionCategories.length === 0 ? (
                                        <div className="text-center text-muted py-3">
                                            No hay categorías de permisos cargadas
                                        </div>
                                    ) : (
                                        permissionCategories.map((category, index) => (
                                            <div key={index} className="mb-4">
                                                <h6 className="fw-bold text-primary border-bottom pb-2">
                                                    <i className="fas fa-shield-alt me-2"></i>
                                                    {category.name}
                                                </h6>
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
                                                {index < permissionCategories.length - 1 && <hr />}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // MENSAJE INFORMATIVO PARA MODO CREACIÓN
                    <div className="alert alert-info mt-3">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Información:</strong> Podrás editar los permisos y menús después de crear el rol.
                    </div>
                )}
            </form>
        </PrimeReactProvider>
    );
};