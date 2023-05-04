import React from 'react';
import { useSelector } from 'react-redux';
import { Image } from 'antd';
import "./style.scss"

const ResBox = (info) => {
    // const { imageDataList } = info;
    const imageList = useSelector(state => {
        console.log(state.ImageList);
        return state.ImageList.imageList;
    })
    return (
        <>
            <div className="resBox">
                <Image.PreviewGroup
                    preview={{
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                >
                {/* {imageList} */}
                <div className="resImg">
                {imageList?.map((imageData,index)=>{
                    {/* console.log(imageData); */}
                    return <Image width={200} src={imageData} alt={`image${index}`} key={index} />
                })}
                </div>
                
            
                </Image.PreviewGroup>
            </div>
        </>
    )
}

export default ResBox;
