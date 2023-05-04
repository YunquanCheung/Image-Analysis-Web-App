import { Tag, Divider } from 'antd';
import React from 'react';
import style from './style.module.scss'

const PrimaryTag = (props) => {
    const {content} = props;
    return (
        <a className={style['primaryTag']} href='#'>
             <Tag >{content}</Tag>
        </a>
    )
}

export default PrimaryTag;
