
import React, { useState, useEffect } from 'react'
import { Toast } from 'primereact/toast'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { useAuth } from './hooks/useAuth'
import ForgotPasswordModal from './ForgotPasswordModal'
import LoginForm from './LoginForm'
import OTPModal from './OTPModal'

function LoginApp() {
    const [currentView, setCurrentView] = useState('login')
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [showOTPModal, setShowOTPModal] = useState(false)
    const [username, setUsername] = useState('')
    const { login } = useAuth()

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const email = urlParams.get('email')
        const firstTime = urlParams.get('first_time')

        if (firstTime === 'true' && email) {
            localStorage.setItem('complete_registration', 'true')
            localStorage.setItem('email', email)
            window.history.replaceState({}, document.title, window.location.pathname)
        }

        const savedUsername = localStorage.getItem('username')
        if (savedUsername && window.location.pathname.includes('forgotPassword')) {
            setUsername(savedUsername)
            setCurrentView('changePassword')
        }
    }, [])

    const handleLogin = async (credentials) => {
        const result = await login(credentials)
        if (result.success) {
            console.log("inicio seccion!!")
        }
    }

    const handleForgotPassword = () => {
        setShowForgotPassword(true)
    }

    const handleOTPRequest = () => {
        setShowForgotPassword(false)
        setShowOTPModal(true)
    }

    const handlePasswordChangeSuccess = () => {
        setCurrentView('login')
        localStorage.removeItem('username')
    }

    const renderCurrentView = () => {
        switch (currentView) {
            case 'changePassword':
                return (
                    <ForgotPasswordModal
                        username={username}
                        onSuccess={handlePasswordChangeSuccess}
                        onCancel={() => setCurrentView('login')}
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
        <div className="app-container relative w-full h-screen overflow-hidden">
            <Toast />
            <ConfirmDialog />


            <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                {renderCurrentView()}
            </div>

            {showForgotPassword && (
                <ForgotPasswordModal
                    visible={showForgotPassword}
                    onHide={() => setShowForgotPassword(false)}
                    onOTPSent={handleOTPRequest}
                />
            )}

            {showOTPModal && (
                <OTPModal
                    visible={showOTPModal}
                    onHide={() => setShowOTPModal(false)}
                    onVerified={() => {
                        setShowOTPModal(false)
                        setCurrentView('changePassword')
                    }}
                />
            )}
        </div>
    )
}

export default LoginApp;