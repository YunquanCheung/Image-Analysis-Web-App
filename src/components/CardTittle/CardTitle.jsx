import React from "react";
import "./style.scss";
import { RightOutlined } from '@ant-design/icons';


const CardTitle = ({
    title,
    description
}) => {
    return (
        <div className="title-wrapper">
            <a href="#" className="title" >
                <h3 className="title-text">{title}
                <RightOutlined />
                </h3>
    
                <div className="title-description">{description}</div>
            </a>
        </div>
    )
}

export default CardTitle;
