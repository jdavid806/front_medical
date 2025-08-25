// components/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ onLogin, onForgotPassword, loading, error }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

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
        <section className="login-section">
            <div className="container-fluid py-0 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100 mx-0">
                    <div className="col-12 col-md-10 col-xl-8 d-flex justify-content-center">
                        <div className="card shadow-lg login-card">
                            <div className="row g-0 w-100 h-100">
                                <div className="col-md-6 col-lg-4 d-flex align-items-center justify-content-center p-4">
                                    <div className="w-100">
                                        <div className="p-4 text-black w-100 text-center">
                                            <img
                                                src="/logo_monaros_sinbg_light.png"
                                                style={{ width: '50%' }}
                                                alt="Logo Medicalsoft"
                                                className="mb-3"
                                            />
                                            <h5 className="fw-bold mb-3">Inicia sesión</h5>

                                            <form onSubmit={handleSubmit}>
                                                <div className="form-outline mb-3">
                                                    <input
                                                        type="email"
                                                        id="user"
                                                        name="username"
                                                        className="form-control"
                                                        value={credentials.username}
                                                        onChange={handleChange}
                                                        onKeyDown={handleKeyPress}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="user">Usuario</label>
                                                </div>

                                                <div className="form-outline mb-3 position-relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="pass"
                                                        name="password"
                                                        className="form-control"
                                                        value={credentials.password}
                                                        onChange={handleChange}
                                                        onKeyDown={handleKeyPress}
                                                        required
                                                    />
                                                    <label className="form-label" htmlFor="pass">Contraseña</label>

                                                    <span
                                                        className="position-absolute end-0 top-50 translate-middle-y me-3"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <i className="fa-solid fa-eye"></i>}
                                                    </span>
                                                </div>

                                                <button
                                                    className="btn btn-dark w-100 mb-2"
                                                    type="submit"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <div className="spinner-border text-light" role="status"></div>
                                                    ) : (
                                                        'Iniciar sesión'
                                                    )}
                                                </button>

                                                <a
                                                    href="#"
                                                    className="d-block text-center mt-2 text-decoration-none"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        onForgotPassword();
                                                    }}
                                                >
                                                    ¿Has olvidado tu contraseña?
                                                </a>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-8 d-none d-md-flex justify-content-center align-items-center position-relative">
                                    <img
                                        src="/medical_index.jpg"
                                        alt="login form"
                                        className="img-fluid login-image"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    );
};

export default LoginForm;