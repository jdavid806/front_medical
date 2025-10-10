import React, { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Steps } from 'primereact/steps';
import { authService } from '../../../services/api';
import { DatosUsuarioModal } from './DatosUsuarioModal';
import { NewPasswordModal } from './NewPasswordModal';

interface ForgotPasswordModalProps {
    visible: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

interface Passwords {
    password: string;
    password_confirmation: string;
}

interface UserData {
    email: string;
    phone: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
    visible,
    onHide,
    onSuccess
}) => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [username, setUsername] = useState<string>('');
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [passwords, setPasswords] = useState<Passwords>({
        password: '',
        password_confirmation: ''
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const toast = useRef<Toast>(null);

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const steps = [
        { label: 'Verificación de Usuario' },
        { label: 'Nueva Contraseña' }
    ];



    const handleSendOTP = async () => {
        if (!username.trim()) {
            showToast('error', 'Error', 'Por favor ingrese su nombre de usuario');
            return;
        }

        setLoading(true);
        try {
            const data = {
                nombre_usuario: username
            };

            const response = await authService.sendOTP(data);

            if (response.status === 200 || response.data?.success) {

                const response = await authService.checkUsernameByTenant(username)
                const userDataFound = response.data.user

                if (userDataFound && userDataFound.email && userDataFound.phone) {
                    setUserData(userDataFound);
                    showToast('success', 'Éxito', `Código OTP enviado correctamente`);
                } else {
                    showToast('error', 'Error', 'No se pudieron obtener los datos del usuario. Contacte al administrador.');
                    setLoading(false);
                    return;
                }

                setOtpSent(true);
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

            // Convertir OTP a número
            const otpNumber = parseInt(otpCode, 10);

            if (isNaN(otpNumber)) {
                showToast('error', 'Error', 'El código OTP debe ser numérico');
                return;
            }

            if (!userData || !userData.email || !userData.phone) {
                showToast('error', 'Error', 'No se encontraron datos completos del usuario');
                return;
            }

            // Crear payload con los datos REALES del usuario
            const payload = {
                email: userData.email,
                phone: userData.phone,
                otp: otpNumber
            };


            const response = await authService.validateOTP(payload);

            if (response.status === 200 || response.data?.success) {
                showToast('success', 'Éxito', 'OTP verificado correctamente');
                setActiveStep(1);
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
                username: username,
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
        setUsername('');
        setOtp(['', '', '', '', '', '']);
        setPasswords({
            password: '',
            password_confirmation: ''
        });
        setOtpSent(false);
        setUserData(null);
    };

    const isStep2Complete = (): boolean => {
        return passwords.password !== '' &&
            passwords.password_confirmation !== '' &&
            passwords.password === passwords.password_confirmation;
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <DatosUsuarioModal
                        username={username}
                        setUsername={setUsername}
                        otp={otp}
                        setOtp={setOtp}
                        otpSent={otpSent}
                        onResendOTP={handleSendOTP}
                        userData={userData}
                    />
                );
            case 1:
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
            case 0: return otpSent ? 'Verificar OTP' : 'Enviar OTP';
            case 1: return 'Cambiar Contraseña';
            default: return 'Siguiente';
        }
    };

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                if (!otpSent) {
                    handleSendOTP();
                } else {
                    handleVerifyOTP();
                }
                break;
            case 1:
                handleChangePassword();
                break;
            default:
                break;
        }
    };

    const isNextDisabled = (): boolean => {
        switch (activeStep) {
            case 0:
                if (!otpSent) {
                    return !username.trim() || loading;
                } else {
                    const isOtpComplete = otp.join('').length === 6;
                    return !isOtpComplete || loading;
                }
            case 1: return !isStep2Complete() || loading;
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

                        <div className="d-flex justify-content-center gap-6 mr-6   mb-4">
                            <div style={{ minWidth: '100px' }}>
                                {activeStep === 0 && otpSent && (
                                    <Button
                                        label="Atrás"
                                        icon={<i className="fa-solid fa-arrow-left"></i>}
                                        className="p-button p-component"
                                        disabled={loading}
                                        onClick={() => setOtpSent(false)}
                                    />
                                )}
                                {activeStep === 1 && (
                                    <Button
                                        label="Atrás"
                                        icon={<i className="fa-solid fa-arrow-left"></i>}
                                        className="p-button p-component"
                                        disabled={loading}
                                        onClick={() => setActiveStep(0)}
                                    />
                                )}
                            </div>

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