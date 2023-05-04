import React, { useState, useEffect } from 'react';
import './style.scss';
import { useSelector } from 'react-redux';


// TODO: The second character display exception problem
const DynamicText = function (props) {
    const [text, setText] = useState('');
    // const desc = useSelector(state => {
    //     console.log(state.DescList.desc);
    //     return state.DescList.descList;
    // });
    let { desc } = props;
    // console.log(desc);
    if (!desc) {
        desc = JSON.parse(localStorage.getItem('descList'))
        // console.log(desc);
    }
    const [showCursor, setShowCursor] = useState(true);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < desc.length) {
                console.log(desc[currentIndex]);
                setText((prevText) => prevText + (desc[currentIndex] ? desc[currentIndex] : ""));
                // setText((preText) => preText+desc[currentIndex] );
                currentIndex++;
                if (currentIndex === desc.length) {
                    clearInterval(interval);
                    setIsFinished(true);
                }
            }
        }, 100);
        return () => clearInterval(interval);
    }, [desc]);

    useEffect(() => {
        let cursorInterval = null;
        if (!isFinished) {
            cursorInterval = setInterval(() => {
                setShowCursor((prevShowCursor) => !prevShowCursor);
            }, 500);
        } else {
            setShowCursor(false);
        }
        return () => clearInterval(cursorInterval);
    }, [isFinished]);

    return (
        <div className="text">
            {text}
            {
                console.log(text)
            }
            {!isFinished && <span className="cursor">{showCursor && '_'}</span>}
            {/* <span className="cursor">{showCursor && '_'}</span> */}
        </div>
    );
}


export default DynamicText;