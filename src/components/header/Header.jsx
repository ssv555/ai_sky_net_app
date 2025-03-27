import React from 'react';
import Button from "../button/button";

const Header = () => {
    const tg = window.Telegram.WebApp;
    const userName = tg.initDataUnsafe?.user?.username;
    const onClose = () => {
        tg.close();
    }

    return (
        <div className={'header'}>
            <Button onClick={onClose} className="app__close">Закрыть</Button>
            <span className={'username'}>{userName}</span>
        </div>
    );
};

export default Header;