import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { authService } from '../../../services/api';

export const ForgotPasswordModal = ({ username, onSuccess }) => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);

    const showToast = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()P
        if (passwords.newPassword !== passwords.confirmPassword) {
            showToast('error', 'Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await authService.changePassword(username, passwords.newPassword);

            showToast('success', 'Éxito', 'Contraseña cambiada correctamente');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (error) {
            showToast('error', 'Error', error.message || 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nueva contraseña *</label>
                    <InputText
                        name="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={handleChange}
                        className="w-100"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Confirmar contraseña *</label>
                    <InputText
                        name="confirmPassword"
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={handleChange}
                        className="w-100"
                        required
                    />
                </div>

                <Button
                    label="Cambiar contraseña"
                    type="submit"
                    loading={loading}
                    className="w-100"
                />
            </form>
        </div>
    );
};