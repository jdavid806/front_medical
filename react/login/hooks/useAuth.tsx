import React, { useState, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { authService } from '../../../services/api'

export const useAuth = () => {
    const [loading, setLoading] = useState(false)
    const toast = useRef<Toast>(null)

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 })
    }

    const login = async (credentials: { username: string; password: string }) => {
        setLoading(true)
        try {
            const response = await authService.login(credentials)

            if (response.status === 200) {
                const token = response.data?.token?.original?.access_token ||
                    response.data?.access_token ||
                    response.data?.token

                if (token) {
                    sessionStorage.setItem('auth_token', token)
                    showToast('success', 'Éxito', 'Inicio de sesión exitoso')

                    setTimeout(() => {
                        window.location.href = '/Dashboard'
                    }, 1000)

                    return { success: true }
                } else {
                    throw new Error('No se recibió un token válido')
                }
            } else {
                throw new Error('Credenciales incorrectas')
            }
        } catch (error: any) {
            showToast('error', 'Error', error.message || 'Error en el inicio de sesión')
            return { success: false, error: error.message }
        } finally {
            setLoading(false)
        }
    }

    return { login, loading, Toast: toast }
}