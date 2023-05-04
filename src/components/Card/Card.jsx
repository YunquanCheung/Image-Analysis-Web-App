import React from 'react';
import { Carousel } from 'antd';
import "./style.scss";

const Card = () => {
    return (
        <>
            <Carousel effect="fade" slide='false' fade='false' autoplay>
                <div>
                    <h3 className="carousel-content">
                        <img src="images/carousel1.jpg" alt="" />
                    </h3>




                </div>
                <div>
                    <h3 className="carousel-content">
                        <img src="images/carousel2.jpg" alt="" />
                    </h3>

                </div>
                <div>
                    <h3 className="carousel-content">
                        <img src="images/carousel3.jpg" alt="" />
                    </h3>
                </div>
                <div>
                    <h3 className="carousel-content">
                        <img src="images/carousel4.jpg" alt="" />
                    </h3>
                </div>
            </Carousel>

        </>

    )

}
export default Card;