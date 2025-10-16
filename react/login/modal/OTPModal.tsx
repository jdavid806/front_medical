import React from 'react';
import { InputOtp, InputOtpChangeEvent } from 'primereact/inputotp';
import { Button } from 'primereact/button';

interface OTPStepProps {
    otp: string[];
    setOtp: React.Dispatch<React.SetStateAction<string[]>>;
    onResendOTP: () => void;
    email: string;
    phone: string;
}

export const OTPModal: React.FC<OTPStepProps> = ({
    otp,
    setOtp,
    onResendOTP
}) => {
    const otpValue = otp.join('');

    const handleOtpChange = (e: InputOtpChangeEvent) => {
        const value = e.value?.toString() || '';

        const newOtpArray = value.split('');

        while (newOtpArray.length < 6) {
            newOtpArray.push('');
        }

        setOtp(newOtpArray);
    };

    return (
        <div className="text-center">
            <p className="text-gray-600 mb-4">
                Hemos enviado un código de 6 dígitos a tu teléfono. Ingrésalo a continuación.
            </p>

            <div className="flex justify-center items-center mb-4">
                <InputOtp
                    value={otpValue}
                    onChange={handleOtpChange}
                    length={6}
                    integerOnly
                    className="justify-center"
                    mask
                    autoComplete='off'
                    type='number'
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
    );
};