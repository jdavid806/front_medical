import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { authService } from '../../../services/api'

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
        <div className="d-flex justify-content-center gap-6">
            <Button
                label="Cancelar"
                onClick={onHide}
                className="btn btn-phoenix-secondary"
                style={{ padding: "0 20px", width: "200px", height: "50px", borderRadius: "0px" }}
            />
            <Button
                label="Enviar OTP"
                loading={loading}
                onClick={handleSubmit}
                style={{ padding: "0 40px", width: "200px", height: "50px", borderRadius: "0px" }}
            />
        </div>
    )

    return (
        <Dialog
            modal
            blockScroll
            header={
                <div className="text-center">
                    <img
                        src="/logo_monaros_sinbg_light.png"
                        alt="Logo"
                        className="w-50 mx-auto mb-3"
                    />
                </div>
            }
            visible={visible}
            onHide={onHide}
            footer={footerContent}
            className="w-11/12 md:w-3/4 lg:w-2/3"
        >
            <p className="text-center text-gray-600 mb-4">
                Ingresa tus datos para recuperar tu contraseña.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Nombre del centro médico *</label>
                            <InputText
                                name="nombreCentro"
                                value={formData.nombreCentro}
                                onChange={handleChange}
                                className="w-100"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Código de país *</label>
                            <InputText
                                name="codPais"
                                value={formData.codPais}
                                onChange={handleChange}
                                className="w-100"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Correo electrónico *</label>
                            <InputText
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-100"
                                required
                            />
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Nombre de usuario *</label>
                            <InputText
                                name="nombreUsuario"
                                value={formData.nombreUsuario}
                                onChange={handleChange}
                                className="w-100"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono *</label>
                            <InputText
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-100"
                                required
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Dialog>
    )
}