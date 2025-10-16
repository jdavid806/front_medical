import React, { useState, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Button } from 'primereact/button'
import { useAuth } from './hooks/useAuth'
import { ForgotPasswordModal } from './modal/ForgotPasswordModal'
import { LoginForm } from './form/LoginForm'
import { OTPModal } from './modal/OTPModal'

export const LoginApp: React.FC = () => {
    const [currentView, setCurrentView] = useState<string>('login')
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])

    const {
        login,
        verifyOtp,
        resendOtp,
        resetOtpFlow,
        loading,
        otpStep,
        loginData,
        Toast: toastRef
    } = useAuth()

    // Función para obtener email del userData - CORREGIDA
    const getUserEmail = () => {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                return parsedData.email || '';
            }
            return '';
        } catch (error) {
            console.error('Error getting user email:', error);
            return '';
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const email = urlParams.get('email')
        const firstTime = urlParams.get('first_time')

        if (firstTime === 'true' && email) {
            localStorage.setItem('complete_registration', 'true')
            // Guardar en userData
            const userData = { email };
            localStorage.setItem('userData', JSON.stringify(userData));
        }

        const savedUsername = localStorage.getItem('username')
        if (savedUsername && window.location.pathname.includes('forgotPassword')) {
            setUsername(savedUsername)
            setCurrentView('changePassword')
        }

        // Simular tiempo de carga inicial
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const handleLogin = async (credentials: { username: string; password: string }) => {
        const result = await login(credentials)
        if (result.success && !result.requiresOtp) {
            console.log("Inicio de sesión exitoso")
        }
    }

    const handleVerifyOtp = async () => {
        const otpCode = otp.join('')
        if (otpCode.length === 6) {
            const result = await verifyOtp(otpCode)
            if (result.success) {
                console.log("OTP verificado exitosamente")
                setOtp(['', '', '', '', '', '']) // Reset OTP
            }
        }
    }

    const handleResendOtp = async () => {
        await resendOtp()
    }

    const handleCancelOtp = () => {
        resetOtpFlow()
        setOtp(['', '', '', '', '', ''])
    }

    const handleForgotPassword = () => {
        setShowForgotPassword(true)
    }

    const handlePasswordChangeSuccess = () => {
        setCurrentView('login')
        setShowForgotPassword(false)
        localStorage.removeItem('username')
    }

    const handleCancelForgotPassword = () => {
        setCurrentView('login')
        setShowForgotPassword(false)
    }

    const renderCurrentView = () => {
        if (otpStep) {
            const userEmail = getUserEmail();

            return (
                <div className="w-100 h-100 d-flex align-items-center justify-content-center p-4">
                    <div className="text-center w-100" style={{ maxWidth: '400px' }}>
                        <div className="text-center mb-4">
                            <img
                                src="assets/img/logos/FullColor.svg"
                                alt="Logo Medicalsoft"
                                className="img-fluid mb-4"
                                style={{ maxWidth: '45%' }}
                            />
                            <h4 className="fw-bold mb-2">Verificación en dos pasos</h4>
                            <p className="text-muted mb-4">
                                Ingresa el código de 6 dígitos enviado a tu teléfono
                                {userEmail && (
                                    <><br /><small className="text-muted">para {userEmail}</small></>
                                )}
                            </p>
                        </div>

                        <OTPModal
                            otp={otp}
                            setOtp={setOtp}
                            onResendOTP={handleResendOtp}
                            email={userEmail}
                            phone=""
                        />

                        <div className="d-flex gap-2 mt-4">
                            <Button
                                label="Cancelar"
                                icon="pi pi-times"
                                className="w-50 p-3"
                                severity="secondary"
                                onClick={handleCancelOtp}
                                disabled={loading}
                            />
                            <Button
                                label={loading ? 'Verificando...' : 'Verificar OTP'}
                                icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
                                className="w-50 p-3"
                                onClick={handleVerifyOtp}
                                loading={loading}
                                disabled={otp.join('').length !== 6}
                            />
                        </div>
                    </div>
                </div>
            )
        }

        switch (currentView) {
            case 'changePassword':
                return (
                    <ForgotPasswordModal
                        visible={true}
                        onHide={handleCancelForgotPassword}
                        onSuccess={handlePasswordChangeSuccess}
                    />
                )
            default:
                return (
                    <LoginForm
                        onLogin={handleLogin}
                        onForgotPassword={handleForgotPassword}
                    />
                )
        }
    }



    return (
        <div className=" d-flex align-items-center justify-content-center bg-light p-4 overflow-hidden">
            <Toast ref={toastRef} />
            <ConfirmDialog />

            {/* Contenedor blanco para resaltar el contenido */}
            <div className="bg-white rounded-3 shadow-lg border border-gray-200 w-100" style={{ maxWidth: '1200px', minHeight: '600px' }}>
                <div className="w-100 h-100">
                    {renderCurrentView()}
                </div>
            </div>

            {showForgotPassword && (
                <ForgotPasswordModal
                    visible={showForgotPassword}
                    onHide={() => setShowForgotPassword(false)}
                    onSuccess={handlePasswordChangeSuccess}
                />
            )}
        </div>
    )
}