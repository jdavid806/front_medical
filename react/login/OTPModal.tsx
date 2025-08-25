// components/OTPModal.jsx
import React, { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { authService } from '../../services/api'

export const OTPModal = ({ visible, onHide, onVerified }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)

    const showToast = (severity, summary, detail) => {
        toast.current?.show({ severity, summary, detail, life: 3000 })
    }

    const handleOtpChange = (index, value) => {
        if (!/^\d?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    const handleVerify = async () => {
        setLoading(true)
        try {
            const otpCode = otp.join('')
            const response = await authService.validateOTP(otpCode)

            if (response.message && response.message.includes('OTP válido')) {
                showToast('success', 'Éxito', 'OTP verificado correctamente')
                onVerified()
            } else {
                throw new Error('OTP inválido')
            }
        } catch (error) {
            showToast('error', 'Error', error.message || 'Error al verificar OTP')
        } finally {
            setLoading(false)
        }
    }

    const isOtpComplete = otp.every(digit => digit !== '')

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header={
                    <div className="text-center">
                        <img
                            src="/logo_monaros_sinbg_light.png"
                            alt="Logo"
                            className="w-1/2 mx-auto mb-3"
                        />
                        <h5 className="text-lg font-semibold">Ingrese el código de verificación</h5>
                    </div>
                }
                visible={visible}
                onHide={onHide}
                className="w-11/12 md:w-1/2 lg:w-1/3"
            >
                <div className="text-center">
                    <p className="text-gray-600 mb-6">
                        El código contiene 6 dígitos, no lo compartas con nadie.
                    </p>

                    <div className="flex justify-center items-center gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <InputText
                                key={index}
                                id={`otp-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl font-bold"
                                maxLength={1}
                                type="text"
                                inputMode="numeric"
                            />
                        ))}
                    </div>

                    <Button
                        label="Verificar"
                        icon="pi pi-check"
                        loading={loading}
                        disabled={!isOtpComplete || loading}
                        onClick={handleVerify}
                        className="w-full"
                    />
                </div>
            </Dialog>
        </>
    )
}

