import React from 'react';
import headerLogo from '../images/logo.svg';

function Header() {
    return (
        <header className="header">
            <img className="logo header__logo" src={headerLogo} alt="Логотип Mesto" />

            <p className="header__mail"></p>
            <button className="header__button"></button>
        </header>
    )
}

export default Header