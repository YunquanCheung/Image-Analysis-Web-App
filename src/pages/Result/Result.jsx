import React from 'react';
import ResBox from '../../components/ResBox/ResBox';
import './style.scss';
import { useSelector } from 'react-redux';
import ChatBox from '../../components/ChatBox/ChatBox';
import CardTitle from '../../components/CardTittle/CardTitle';
import DynamicText from '../../components/DynamicText/DynamicText';

const Result = () => {
    // const imageList = useSelector(state => {
    //     console.log(state.ImageList);
    //     return state.ImageList.imageList;

    // })
    const desc = useSelector(state => {
        console.log(state.DescList);
        return state.DescList.descList;
    })
    return (
        <>
            <div className="resBody">
                {/* {imageList} */}
                <div className="resConten">
                    <CardTitle
                        title="Results"
                        description="Please upload an image you want to analysis" />
                    <ResBox />
                    <div className="desc">
                        <DynamicText desc={desc} />
                    </div>

                </div>

                <div className="chat">
                    <ChatBox />
                </div>


            </div>

        </>
    )

}

export default Result;