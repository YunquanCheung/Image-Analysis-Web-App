import React, { useState } from "react";
import './style.scss';
import Card from "../../components/Card/Card";
import UploadImg from "../../components/UploadImg/UploadImg";
import PrimaryTag from '../../components/PrimaryTag/PrimaryTag'
import CardTitle from "../../components/CardTittle/CardTitle";
import ChatBox from "../../components/ChatBox/ChatBox";

const Home = () => {


    return (
        <div className="home">
            <div className="content">
                <div className="carousel">
                    <Card />
                </div>

                <div className="upload">
                    <CardTitle
                        title="Upload an Image You Want to Identify"
                        description="Please upload an image you want to analysis" />
                    {/* <p className="header">
                        Upload an Image You Want to Identify:
                    </p> */}
                    <UploadImg />
                </div>


            </div>
            <div className="chat">
                <ChatBox />
            </div>
        </div>


    )
}
export default Home;
