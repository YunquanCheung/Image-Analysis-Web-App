

import React, { useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from './router/AppRouter';
import Header from './pages/Header/Header';
import Footer from './pages/Footer/Footer'
import './App.css';
import { ConfigProvider } from "antd";



const App = (props) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#ffa940',
                },
            }}>
            <div className="App">
                <BrowserRouter>
                    <Header />
                    <AppRouter />
                    <Footer />
                </BrowserRouter>
            </div>
        </ConfigProvider>
    )
}

export default App;

