import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useAuth } from './hooks/useAuth';

export const LoginForm = ({ onLogin, onForgotPassword }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const { loading } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(credentials);
    };

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleKeyPress = (e) => {
        if (e.code === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center p-0 bg-white">
            <div className="container-fluid h-100 p-0">
                <div className="row g-0 h-100">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-3 p-md-4 p-lg-5">
                        <div className="w-100" style={{ maxWidth: '450px' }}>
                            <div className="text-center mb-4">
                                <img
                                    src="/logo_monaros_sinbg_light.png"
                                    alt="Logo Medicalsoft"
                                    className="img-fluid mb-4"
                                    style={{ maxWidth: '65%' }}
                                />
                                <h2 className="h3 fw-bold text-gray-800 mb-3">Inicia sesión</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="w-100">
                                <div className="mb-4">
                                    <label htmlFor="username" className="form-label fw-semibold">
                                        Usuario
                                    </label>
                                    <InputText
                                        id="username"
                                        name="username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyPress}
                                        className="w-100 p-3"
                                        required
                                        placeholder="Ingresa tu usuario"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label fw-semibold">
                                        Contraseña
                                    </label>
                                    <Password
                                        id="password"
                                        name="password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyPress}
                                        className="w-100"
                                        toggleMask
                                        feedback={false}
                                        placeholder="Ingresa tu contraseña"
                                        required
                                        inputClassName="w-100 p-3"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    label="Iniciar sesión"
                                    icon={loading ? 'pi pi-spinner pi-spin' : 'pi pi-sign-in'}
                                    loading={loading}
                                    className="w-100 py-3 bg-gray-900 border-gray-900 hover:bg-gray-800"
                                    style={{ fontSize: '1.1rem' }}
                                />
                            </form>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={onForgotPassword}
                                    className="btn btn-link text-decoration-none p-0 text-primary fw-medium"
                                >
                                    ¿Has olvidado tu contraseña?
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0">
                        <div className="h-100 w-100 d-flex align-items-center justify-content-center">
                            <img
                                src="/medical_index.jpg"
                                alt="login form"
                                className="img-fluid h-100 w-100 object-fit-cover"
                                style={{ objectPosition: 'center' }}
                            />
                            <div className="position-absolute text-center text-white p-4" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: '10px'
                            }}>
                                <h2 className="h2 fw-bold mb-3">Sistema Médico Integral</h2>
                                <p className="lead">Plataforma de gestión médica especializada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};