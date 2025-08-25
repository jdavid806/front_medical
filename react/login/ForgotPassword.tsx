// components/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const ForgotPasswordModal = ({ onClose, onOTPSent }) => {
    const [formData, setFormData] = useState({
        nombreCentro: '',
        nombreUsuario: '',
        codPais: '',
        telefono: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiUrl = `${window.location.origin}/api/auth/otp/send-otp`;

            const datos = {
                nombre_del_centro_medico: formData.nombreCentro,
                nombre_usuario: formData.nombreUsuario,
                cod_pais: formData.codPais,
                phone: formData.codPais + formData.telefono,
                email: formData.email
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (data.message && data.message.includes("OTP enviado")) {
                await Swal.fire('✅', 'OTP enviado correctamente.', 'success');
                localStorage.setItem("username", formData.nombreUsuario);
                onOTPSent();
            } else {
                throw new Error('Error al enviar OTP');
            }
        } catch (error) {
            console.error("Error:", error);
            await Swal.fire('Error', 'Ocurrió un error al enviar OTP.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block"  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header text-center">
                        <div className="w-100">
                            <img src="/logo_monaros_sinbg_light.png" style={{ width: '50%' }} alt="Logo" className="mb-3" />
                        </div>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p className="text-center">Ingresa tus datos para recuperar tu contraseña.</p>
                        <form id="forgotPasswordForm" onSubmit={handleSubmit}>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><i className="bi bi-hospital"></i></span>
                                <input
                                    type="text"
                                    name="nombreCentro"
                                    className="form-control"
                                    placeholder="Nombre del centro médico"
                                    value={formData.nombreCentro}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><i className="bi bi-person"></i></span>
                                <input
                                    type="text"
                                    name="nombreUsuario"
                                    className="form-control"
                                    placeholder="Nombre de usuario"
                                    value={formData.nombreUsuario}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><i className="bi bi-globe"></i></span>
                                <input
                                    type="text"
                                    name="codPais"
                                    className="form-control"
                                    placeholder="Código de país"
                                    value={formData.codPais}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><i className="bi bi-telephone"></i></span>
                                <input
                                    type="text"
                                    name="telefono"
                                    className="form-control"
                                    placeholder="Teléfono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3 input-group">
                                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordModal;