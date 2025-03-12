import React, { useState } from 'react'
import UserTable from './UserTable'
import UserFormModal from './UserFormModal'

export const UserApp = () => {

    const [showUserFormModal, setShowUserFormModal] = useState(false)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(e.currentTarget);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(Array.from(formData.entries()));

        const finalData = {
            "username": data.username,
            "email": "22222@example.com",
            "password": data.password,
            "first_name": "Jeferson",
            "middle_name": "David",
            "last_name": "Dávila",
            "second_last_name": "Valencia",
            "user_role_id": 1,
            "user_specialty_id": 1,
            "country_id": 1,
            "city_id": 1,
            "gender": "MALE",
            "address": data.address,
            "phone": data.phone
        }
        console.log(data, finalData);
    };

    const handleOpenUserFormModal = () => {
        setShowUserFormModal(true)
    }

    const handleHideUserFormModal = () => {
        setShowUserFormModal(false)
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-1">Usuarios</h4>
                <div className="text-end mb-2">
                    <div className="dropdown">
                        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fas fa-plus"></i> &nbsp; Nuevo
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalEntidad">Entidad</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoProcedimiento">Procedimiento</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoVendedor">Vendedor</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoImpuesto">Impuesto Cargo</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoMetodoPago">Metodo de Pago</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalNuevoImpuestoRetencion">Impuesto Retencion</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#addCostsCenter">Centro de Costo</a></li>
                            <li>
                                <a
                                    className="dropdown-item"
                                    onClick={handleOpenUserFormModal}>Usuario
                                </a>
                            </li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalUserSpecialty">Especialidad médica</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalUserRole">Rol de usuario</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalCreateUserOpeningHour">Horario de atención</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalPrice">Precio</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalConsent">Consentimientos</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#newMessage">Mensajería masiva</a></li>
                            <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#modalBasicTemplate">Plantilla</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <UserTable></UserTable>
            <UserFormModal
                show={showUserFormModal}
                handleSubmit={handleSubmit}
                onHide={handleHideUserFormModal}
            ></UserFormModal>
        </>
    )
}
