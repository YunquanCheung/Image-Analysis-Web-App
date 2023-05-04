import React, { useState } from "react";
import './style.scss';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from "react-router-dom";
import { AppstoreOutlined, MailOutlined, FileTextOutlined } from '@ant-design/icons';
import { Menu } from 'antd';



const { Search } = Input;
const { SubMenu } = Menu;

const items = [

    {
        label: 'Related Info',
        key: 'SubMenu',
        icon: <FileTextOutlined />,
        children: [
            {
                type: 'group',
                label: 'Related Docs',
                children: [
                    {
                        label: (
                            <a href="https://ieeexplore.ieee.org/document/8237336" target="_blank" rel="noopener noreferrer">
                                Grad-CAM
                            </a>),
                        key: 'setting:1',
                    },
                    {
                        label: (
                            <a href="https://ieeexplore.ieee.org/document/8354201" target="_blank" rel="noopener noreferrer">
                                Grad-CAM++
                            </a>
                        ),
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        label: (
            <a href="#TODO" target="_blank" rel="noopener noreferrer">
                About us
            </a>
        ),
        key: 'developer',
    },
];
const Header = () => {
    const [current, setCurrent] = useState('SubMenu');
    const onClick = (e) => {
        // console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div className="headerLZ">
            <div className="logo">
                <a className="logoLink" href="#">
                    {/* <p className="bg"></p> */}
                    {/* <img src='/image/logo_Desktop.svg' alt='homepage' width="121" height="31" /> */}
                    <img className="logoImg" src='/logo3.jpg' alt='homepage' width="60" height="50" />
                </a>
            </div>
            <div className="func">
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />

            </div>
        </div>

    )

};



export default Header;
