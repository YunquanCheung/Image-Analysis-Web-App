import React from 'react';
import style from './style.module.scss';
import { Input, Button } from 'antd';


const ConfirmBtn = (
    {   text,
        loading,
        className,
        onClick,
        type,
        htmlType,
        // style,
        ...props
    }
) => {
    return (
        <Button
            className={`${style['primary-button']} ${style['btn-glitch']} ${className ? className : ' '}`}
            loading={loading}
            onClick={onClick}
            type={type ? type : "default"}
            htmlType={htmlType ? htmlType : "button"}
            id={1111}

        >
            {text}
            {props.children}

        </Button>
    )

}

export default ConfirmBtn;

