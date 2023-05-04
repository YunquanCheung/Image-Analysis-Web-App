import React, { createRef } from 'react';
import './style.scss';

const FooterBottom = () => {
    return (
        <div className="footer-bottom">
            <div className='footer-bottom-content'>
                <div className='footer-bt-info'>
                <a className="footer-bt-info-link link-first" href="#" rel="nofollow">
                    FAQ
                </a>
                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    help
                </a>
                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    Home
                </a>
                </div>

                <div className='footer-bt-info'>
                <a className="footer-bt-info-link link-first" href="#" rel="nofollow">
                    About us
                </a>
                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    Contact Us
                </a>

                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    Terms & Policies
                </a>
                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    Safety Information
                </a>
                <a className="footer-bt-info-link" href="#" rel="nofollow">
                    Feedbacks
                </a>
                </div>
                <font>
                    © 2023 MengProject by Xiang Lan and Yunquan Zhang 
                </font>
            </div>
        </div>

    )
}

export default FooterBottom;