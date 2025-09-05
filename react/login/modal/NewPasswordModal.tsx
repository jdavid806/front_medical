import React, { useState, useEffect } from 'react';
import { Password } from 'primereact/password';
import { Message } from 'primereact/message';

interface NuevaPasswordStepProps {
    passwords: {
        password: string;
        password_confirmation: string;
    };
    setPasswords: React.Dispatch<React.SetStateAction<{
        password: string;
        password_confirmation: string;
    }>>;
}

export const NewPasswordModal: React.FC<NuevaPasswordStepProps> = ({
    passwords,
    setPasswords
}) => {
    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        hasUppercase: false,
        hasSpecialChar: false
    });

    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useEffect(() => {
        const errors = {
            minLength: passwords.password.length >= 8,
            hasUppercase: /[A-Z]/.test(passwords.password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwords.password)
        };
        setPasswordErrors(errors);
    }, [passwords.password]);

    useEffect(() => {
        if (passwords.password_confirmation && passwords.password !== passwords.password_confirmation) {
            setConfirmPasswordError('Las contraseñas no coinciden');
        } else {
            setConfirmPasswordError('');
        }
    }, [passwords.password, passwords.password_confirmation]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });
    };

    const passwordHeader = <h6>Por favor, ingrese una contraseña que cumpla con:</h6>;

    const passwordFooter = (
        <React.Fragment>
            <div className="p-mt-2">
                <div className={passwordErrors.minLength ? "text-green-500" : "text-red-500"}>
                    {passwordErrors.minLength ? "✓ " : "✗ "}Mínimo 8 caracteres
                </div>
                <div className={passwordErrors.hasUppercase ? "text-green-500" : "text-red-500"}>
                    {passwordErrors.hasUppercase ? "✓ " : "✗ "}Al menos 1 mayúscula
                </div>
                <div className={passwordErrors.hasSpecialChar ? "text-green-500" : "text-red-500"}>
                    {passwordErrors.hasSpecialChar ? "✓ " : "✗ "}Al menos 1 caracter especial (!@#$...)
                </div>
            </div>
        </React.Fragment>
    );

    return (
        <div className="p-fluid">
            <div className="field">
                <label htmlFor="password" className="block">Nueva contraseña *</label>
                <Password
                    id="password"
                    name="password"
                    value={passwords.password}
                    onChange={handleChange}
                    className="w-full"
                    required
                    toggleMask
                    header={passwordHeader}
                    footer={passwordFooter}
                />
            </div>

            <div className="field">
                <label htmlFor="password_confirmation" className="block">Confirmar contraseña *</label>
                <Password
                    id="password_confirmation"
                    name="password_confirmation"
                    value={passwords.password_confirmation}
                    onChange={handleChange}
                    className="w-full"
                    required
                    toggleMask
                    feedback={false}
                />
                {confirmPasswordError && (
                    <Message severity="error" text={confirmPasswordError} className="mt-2" />
                )}
            </div>
        </div>
    );
};