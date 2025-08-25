// components/ForgotPasswordModal.jsx
import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { authService } from '../../services/api'

export const ForgotPasswordModal = ({ visible, onHide, sendOTP }) => {
    const [formData, setFormData] = useState({
        nombreCentro: '',
        nombreUsuario: '',
        codPais: '',
        telefono: '',
        email: ''
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const datos = {
                nombre_del_centro_medico: formData.nombreCentro,
                nombre_usuario: formData.nombreUsuario,
                cod_pais: formData.codPais,
                phone: formData.codPais + formData.telefono,
                email: formData.email
            }

            const response = await authService.login(datos)

            if (response.message && response.message.includes('OTP enviado')) {
                localStorage.setItem('username', formData.nombreUsuario)
                sendOTP()
            } else {
                throw new Error('Error al enviar OTP')
            }
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setLoading(false)
        }
    }

    const footerContent = (
        <div className="flex justify-end gap-2">
            <Button
                label="Cancelar"
                onClick={onHide}
                className="p-button-text"
            />
            <Button
                label="Enviar OTP"
                loading={loading}
                onClick={handleSubmit}
            />
        </div>
    )

    return (
        <Dialog
            header={
                <div className="text-center">
                    <img
                        src="/logo_monaros_sinbg_light.png"
                        alt="Logo"
                        className="w-1/2 mx-auto mb-3"
                    />
                </div>
            }
            visible={visible}
            onHide={onHide}
            footer={footerContent}
            className="w-11/12 md:w-1/2 lg:w-1/3"
        >
            <p className="text-center text-gray-600 mb-4">
                Ingresa tus datos para recuperar tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="field">
                    <label className="block text-sm font-medium mb-2">Nombre del centro médico</label>
                    <InputText
                        name="nombreCentro"
                        value={formData.nombreCentro}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
                    <InputText
                        name="nombreUsuario"
                        value={formData.nombreUsuario}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium mb-2">Código de país</label>
                    <InputText
                        name="codPais"
                        value={formData.codPais}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <InputText
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>

                <div className="field">
                    <label className="block text-sm font-medium mb-2">Correo electrónico</label>
                    <InputText
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full"
                        required
                    />
                </div>
            </form>
        </Dialog>
    )
}

