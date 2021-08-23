import React from 'react';

function Login(props) {
    return (
        <div className="auth">
            <h2 className="auth__title">Вход</h2>

            <form className="auth__form">
                <input
                    className="auth__input"
                    type="text"
                    placeholder="Email"
                />

                <input
                    className="auth__input"
                    type="password"
                    placeholder="Пароль"
                />

                <button
                    className="auth__button"
                    type="submit">
                    Войти
                </button>
            </form>
        </div>
    )
}

export default Login;