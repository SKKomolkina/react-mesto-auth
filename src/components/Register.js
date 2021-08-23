import React from 'react';

function Register() {
    return (
        <div className="auth">
            <h2 className="auth__title">Регистрация</h2>

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
                    Зарегистрироваться
                </button>
            </form>
        </div>
    )
}

export default Register;