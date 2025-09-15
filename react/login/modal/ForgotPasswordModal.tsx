import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { authService } from '../../../services/api';
import { DatosUsuarioModal } from './DatosUsuarioModal';
import { OTPModal } from './OTPModal';
import { NewPasswordModal } from './NewPasswordModal';

interface ForgotPasswordModalProps {
    visible: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

interface FormData {
    nombreCentro: string;
    nombreUsuario: string;
    codPais: string;
    phone: string;
    email: string;
}

interface Passwords {
    password: string;
    password_confirmation: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    visible,
    onHide,
    onSuccess
}) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [formData, setFormData] = useState<FormData>({
        nombreCentro: '',
        nombreUsuario: '',
        codPais: '',
        phone: '',
        email: ''
    });
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [passwords, setPasswords] = useState<Passwords>({
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const steps = [
        { label: 'Datos de Usuario' },
        { label: 'Verificación OTP' },
        { label: 'Nueva Contraseña' }
    ];

    const handleSendOTP = async () => {
        setLoading(true);
        try {
            const data = {
                nombre_del_centro_medico: formData.nombreCentro,
                nombre_usuario: formData.nombreUsuario,
                cod_pais: formData.codPais,
                phone: formData.codPais + formData.phone,
                email: formData.email
            };
            console.log(data, 'datos');
            const response = await authService.sendOTP(data);

            if (response.status === 200 || response.data?.success) {
                localStorage.setItem('username', formData.nombreUsuario);
                setActiveStep(1);
                showToast('success', 'Éxito', 'Código OTP enviado correctamente');
            } else {
                throw new Error(response.data?.message || 'Error al enviar OTP');
            }
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || error.message || 'Error al enviar OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setLoading(true);
        try {
            const otpCode = otp.join('').trim();

            if (!/^\d{6}$/.test(otpCode)) {
                showToast('error', 'Error', 'El código OTP debe tener 6 dígitos numéricos');
                return;
            }

            const payload = {
                otp: otpCode,
                email: formData.email,
                phone: formData.phone
            };

            console.log('Payload OTP:', payload);

            const response = await authService.validateOTP(payload);

            if (response.status === 200 || response.data?.success) {
                showToast('success', 'Éxito', 'OTP verificado correctamente');
                setActiveStep(2);
            } else {
                throw new Error(response.data?.message || 'OTP inválido');
            }
        } catch (error: any) {
            showToast('error', 'Error', error.response?.data?.message || error.message || 'Error al verificar OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwords.password !== passwords.password_confirmation) {
            showToast('error', 'Error', 'Las contraseñas no coinciden');
            return;
        }

        const isLengthValid = passwords.password.length >= 8;
        const isUppercaseValid = /[A-Z]/.test(passwords.password);
        const isSpecialValid = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.password);

        if (!isLengthValid || !isUppercaseValid || !isSpecialValid) {
            showToast('error', 'Error', 'La contraseña no cumple con los requisitos');
            return;
        }

        setLoading(true);

        try {
            const changePasswordData = {
                username: formData.nombreUsuario,
                password: passwords.password,
                password_confirmation: passwords.password_confirmation,
            };

            const apiUrl = `${window.location.origin}/api/auth/change-password`;
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(changePasswordData)
            });

            if (response.ok) {
                const data = await response.json();

                if (data.status === 200 || data.success) {
                    showToast('success', 'Éxito', 'Contraseña cambiada correctamente');
                    setTimeout(() => {
                        onSuccess();
                        onHide();
                        resetForm();
                    }, 1500);
                } else {
                    throw new Error(data.message || 'Error al cambiar la contraseña');
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
        } catch (error: any) {
            showToast('error', 'Error', error.message || 'Error al cambiar la contraseña');
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setActiveStep(0);
        setFormData({
            nombreCentro: '',
            nombreUsuario: '',
            codPais: '',
            phone: '',
            email: ''
        });
        setOtp(['', '', '', '', '', '']);
        setPasswords({
            password: '',
            password_confirmation: ''
        });
    };

    const isStep1Complete = (): boolean => {
        return formData.nombreCentro !== '' &&
            formData.nombreUsuario !== '' &&
            formData.codPais !== '' &&
            formData.phone !== '' &&
            formData.email !== '';
    };

    const isStep2Complete = (): boolean => {
        return otp.every(digit => digit !== '');
    };

    const isStep3Complete = (): boolean => {
        return passwords.password !== '' &&
            passwords.password_confirmation !== '' &&
            passwords.password === passwords.password_confirmation;
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <DatosUsuarioModal
                        formData={formData}
                        setFormData={setFormData}
                    />
                );
            case 1:
                return (
                    <OTPModal
                        otp={otp}
                        setOtp={setOtp}
                        onResendOTP={handleSendOTP}
                        email={formData.email}
                        phone={formData.phone}
                    />
                );
            case 2:
                return (
                    <NewPasswordModal
                        passwords={passwords}
                        setPasswords={setPasswords}
                    />
                );
            default:
                return null;
        }
    };

    const getNextButtonLabel = (): string => {
        switch (activeStep) {
            case 0: return 'Enviar OTP';
            case 1: return 'Verificar OTP';
            case 2: return 'Cambiar Contraseña';
            default: return 'Siguiente';
        }
    };

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                handleSendOTP();
                break;
            case 1:
                handleVerifyOTP();
                break;
            case 2:
                handleChangePassword();
                break;
            default:
                break;
        }
    };

    const isNextDisabled = (): boolean => {
        switch (activeStep) {
            case 0: return !isStep1Complete() || loading;
            case 1: return !isStep2Complete() || loading;
            case 2: return !isStep3Complete() || loading;
            default: return true;
        }
    };

    return (
        <>
            <Toast ref={toast} />
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
                        <h4>Recuperar Contraseña</h4>
                    </div>
                }
                visible={visible}
                onHide={() => {
                    onHide();
                    resetForm();
                }}
                className="w-11/12 md:w-3/4 lg:w-2/3"
                footer={
                    <div className="flex justify-content-between align-items-center">
                        {/* Botón Atrás - Solo visible en steps 2 y 3 */}
                        <div style={{ minWidth: '100px' }}>
                            {activeStep > 0 && (
                                <Button
                                    label="Atrás"
                                    icon={<i className="fa-solid fa-arrow-left"></i>}
                                    className="p-button p-component"
                                    disabled={loading}
                                    onClick={() => setActiveStep(activeStep - 1)}
                                />
                            )}
                        </div>

                        <div className="d-flex justify-content-center gap-6 mt-5 mb-4">
                            <Button
                                label="Cancelar"
                                icon={<i className="fa-solid fa-xmark"></i>}
                                className="p-button p-component"
                                disabled={loading}
                                onClick={() => {
                                    onHide();
                                    resetForm();
                                }}
                            />
                            <Button
                                label={getNextButtonLabel()}
                                icon={<i className="fas fa-arrow-left"></i>}
                                className='p-button p-component'
                                iconPos="right"
                                loading={loading}
                                disabled={isNextDisabled()}
                                onClick={handleNext}
                            />
                        </div>

                        <div style={{ minWidth: '100px' }}></div>
                    </div>
                }
            >
                <Steps
                    model={steps}
                    activeIndex={activeStep}
                    className="mb-5"
                    readOnly={false}
                />
                <div className="p-3">
                    {renderStepContent()}
                </div>
            </Dialog>
        </>
    );
};