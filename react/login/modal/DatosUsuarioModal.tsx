import React from 'react';
import { InputText } from 'primereact/inputtext';
import { InputOtp, InputOtpChangeEvent } from 'primereact/inputotp';
import { Button } from 'primereact/button';

interface DatosUsuarioStepProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    otpSent: boolean;
    onResendOTP: () => void;
}

export const DatosUsuarioModal: React.FC<DatosUsuarioStepProps> = ({
    username,
    setUsername,
    otp,
    setOtp,
    otpSent,
    onResendOTP
}) => {
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handleOtpChange = (e: InputOtpChangeEvent) => {
        const value = e.value?.toString() || '';

        const newOtpArray = value.split('');

        while (newOtpArray.length < 6) {
            newOtpArray.push('');
        }

        setOtp(newOtpArray);
    };

    const otpValue = otp.join('');

    return (
        <div className="row">
            <div className="col-12">
                {!otpSent ? (
                    <div className="text-center">
                        <div className="mb-4">
                            <p className="text-gray-600 mb-4">
                                Ingresa tu nombre de usuario para recuperar tu contraseña.
                            </p>
                        </div>

                        <div className="mb-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
                            <label htmlFor="username" className="form-label text-left d-block">
                                Nombre de usuario *
                            </label>
                            <InputText
                                id="username"
                                name="username"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-100"
                                placeholder="Ingresa tu nombre de usuario"
                            />
                        </div>
                    </div>
                ) : (
                    // Sección de OTP
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            Hemos enviado un código de 6 dígitos a tu teléfono registrado. Ingrésalo a continuación.
                        </p>

                        <div className="flex justify-center items-center mb-4">
                            <InputOtp
                                value={otpValue}
                                onChange={handleOtpChange}
                                length={6}
                                integerOnly
                                className="justify-center"
                                mask
                            />
                        </div>

                        <div className="text-center mt-3">
                            <span>¿No recibiste el código? </span>
                            <Button
                                style={{ padding: "0px" }}
                                label="Reenviar OTP"
                                link
                                onClick={onResendOTP}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};