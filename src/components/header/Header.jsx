import React from 'react';
import Button from "../button/Button";
import { useTelegram } from "../../hooks/useTelegram";

const Header = () => {
    const { user, onClose } = useTelegram();

    return (
        <div className={'header'}>
            <Button onClick={onClose} className="app__close">Закрыть</Button>
            <span> - </span>
            <span className={'username'}>{user?.username}</span>
        </div>
    );
};

export default Header; 