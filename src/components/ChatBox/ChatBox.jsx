import React, { useState, useRef, useEffect } from "react";
import { Layout, Input, Button, List } from "antd";
import ConfirmBtn from "../ConfirmBtn/ConfirmBtn";
import axios from "axios";
import { CommentOutlined } from '@ant-design/icons';
// import "antd/dist/antd.css";
import './style.scss'
import DynamicText from "../DynamicText/DynamicText";

const { Header, Content, Footer } = Layout;

const SERVER_URL = 'http://localhost:8080'
const CHAT_URL = `${SERVER_URL}/chat`

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    // const inputRef = useRef(null);

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        const getLastMessage = async () => {
            if (messages.length > 0 && messages[messages.length - 1].sender === "user") {
                setLoading(true);
                try {
                    const response = await axios.post(CHAT_URL, {
                        message: messages[messages.length - 1].text,
                    });
                    const newMessage = {
                        id: messages.length + 1,
                        text: response.data,
                        sender: "bot",
                    };
                    setMessages([...messages, newMessage]);
                } catch (error) {
                    // TODO: only for dev
                    const newMessage = {
                        id: messages.length + 1,
                        text: 'Itt is a message from robot',
                        sender: "bot",
                    };
                    setMessages([...messages, newMessage]);
                    console.error(error);
                }
                setLoading(false);
                // inputRef.current.setState({ value: "" });
                setInputValue("");
            }
        };
        getLastMessage();
    }, [messages])
    const handleSendMessage = async () => {
        // console.log(inputRef.current.input);
        // const inputValue = inputRef.current.input.value?.trim();
        const sent = inputValue;
        if (inputValue) {
            const newMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: "user",
            };
            console.log(newMessage)
            setMessages([...messages, newMessage]);
            // inputRef.current.input.value = "";
            // console.log(inputRef.current)
            // inputRef.current.focus();
            console.log(messages);
            setInputValue("");
            // // 模拟ChatGPT返回的回答
            // setLoading(true);
            // let response = null;
            // try {
            //     response = await axios.post(CHAT_URL, { message: sent });
            //     // setLoading(false);
            //     // handleReceiveMessage("这是ChatGPT返回的回答。" + response);
            // } catch (error) {
            //     console.error(error);
            // }
            // setLoading(false);
            // handleReceiveMessage("这是ChatGPT返回的回答。" + response);
        }
    };

    const handleReceiveMessage = (text) => {
        const newMessage = {
            id: messages.length + 1,
            text,
            sender: "bot",
        };
        console.log(messages);
        setMessages([...messages, newMessage]);
    };

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            handleSendMessage();
        }
    };

    return (
        <Layout className="layout" >
            <Header className="header" >
                <CommentOutlined />
                ChatGPT</Header>
            <Content className="content">
                <div className="messages">
                    {console.log(messages)}
                    {messages.map((message) => {
                        console.log(message);
                        return (
                            <div
                                key={message.id}
                                style={{
                                    display: "flex",
                                    justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                                }}
                            >
                                <div
                                    className="message"
                                    style={{
                                        backgroundColor: message.sender === "user" ? "#ffe7ba" : "#f0f0f0",
                                        color: message.sender === "user" ? "#000" : "#000",

                                    }}
                                >
                                    {message.sender === "user" ? message.text : <DynamicText desc={message.text} />}
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>
            </Content>
            <Footer className="footer">
                <Input
                    className="chat-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    type="text"
                    // ref={inputRef}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your message"

                    suffix={

                        <ConfirmBtn
                            className="input-button"
                            type="primary"
                            onClick={handleSendMessage}

                            loading={loading}
                            // loading={true}
                            text="Send"
                        >
                        </ConfirmBtn>
                    }
                />

            </Footer>
        </Layout>
    );
};

export default ChatBox;
