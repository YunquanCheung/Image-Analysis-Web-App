import React, { useState } from 'react';
import Footer from '../Footer';
import './style.scss';
import { Input, Button, message } from 'antd';
import { GithubOutlined, TwitterOutlined, InstagramOutlined, FacebookOutlined } from '@ant-design/icons';
import ConfirmBtn from '../../../components/ConfirmBtn/ConfirmBtn';

const FooterTop = () => {
    const [loading, setLoading] = useState(false);

    const handleClick = (e) => {
        console.log("test");
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
            message.success({
                duration: 1,
                content: 'Subscribe Success',
                className: 'my-message',
                style: {
                    marginTop: '10vh',

                },
            });
            clearTimeout(timer);
        }, 1000)

    }
    return (
        <div className="footer-top">
            <div className="footer-top-content">
                <div className="follow">
                    <h3 className="follow-text">
                        Follow Us
                    </h3>
                    <ul className="follow-links">
                        <li>
                            <a className="follow-links-logo" href="#">
                                <GithubOutlined style={{ color: '#434343', fontSize: "20px" }} />
                            </a>
                        </li>
                        <li>
                            <a className='follow-links-logo' href="#">
                                <TwitterOutlined style={{ color: '#434343', fontSize: "20px" }} />
                            </a>
                        </li>

                        <li><a className='follow-links-logo' href="#">
                            <FacebookOutlined style={{ color: '#434343', fontSize: "20px" }} />
                        </a></li>

                        <li><a className='follow-links-logo' href="#">
                            <InstagramOutlined style={{ color: '#434343', fontSize: "20px" }} />
                        </a></li>
                    </ul>
                </div>
                <div className="subscribe">
                    <h3 className='subscribe-text'>
                    Get the Latest Technology Updates
                    </h3>

                    <Input className="subscribe-input"
                        placeholder='Please Input your Email:'
                        suffix={

                            <ConfirmBtn

                                className="input-button"
                                loading={loading}
                                // loading={true}
                                onClick={handleClick}
                                text="Subscribe"
                            >
                            </ConfirmBtn>
                        }
                    />

                </div>
            </div>
        </div>
    )
}

export default FooterTop;
