import React, { useState, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { useAuth } from './hooks/useAuth'
import { ForgotPasswordModal } from './modal/ForgotPasswordModal'
import { LoginForm } from './form/LoginForm'

export const LoginApp: React.FC = () => {
    console.log("Holaaa Renderizo");
    const [currentView, setCurrentView] = useState<string>('login')
    const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
    const [username, setUsername] = useState<string>('')
    const { login, loading, Toast: toastRef } = useAuth()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const email = urlParams.get('email')
        const firstTime = urlParams.get('first_time')

        if (firstTime === 'true' && email) {
            localStorage.setItem('complete_registration', 'true')
            localStorage.setItem('email', email)
        }

        const savedUsername = localStorage.getItem('username')
        if (savedUsername && window.location.pathname.includes('forgotPassword')) {
            setUsername(savedUsername)
            setCurrentView('changePassword')
        }
    }, [])

    const handleLogin = async (credentials: { username: string; password: string }) => {
        const result = await login(credentials)
        if (result.success) {
            console.log("Inicio de sesión exitoso")
        }
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
        <div className="app-container w-full h-full flex items-center justify-center overflow-hidden">
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                {renderCurrentView()}
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