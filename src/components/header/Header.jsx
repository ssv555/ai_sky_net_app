import React from 'react';
import Button from "../button/button";
import { useTelegram } from "../../hooks/useTelegram";

const Header = () => {
    const { user, onClose, onToggleButton, onToggleButtonText } = useTelegram();

    return (
        <div className={'header'}>
            <Button onClick={onClose} className="app__close">Закрыть</Button>
            <span className={'username'}>{user?.username}</span>
        </div>
    );
};

export default Header;