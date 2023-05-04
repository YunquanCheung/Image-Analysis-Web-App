import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import NotFound from '../pages/NotFound/NotFound'
import Home from '../pages/Home/Home'
import Result from '../pages/Result/Result'
// import Login from '../pages/Login/Login'
// import MovieStore from '../pages/MovieStore/MovieStore'
// import Details from '../pages/Details/Details'
// import Register from "../pages/Register/Register";
// import Personal from "../pages/Personal/Personal";
// import Search from "../pages/Search/Search";


// TO DO
const id = true

const AppRouter = () => {
    return (

            <Routes>
                <Route path='/' element={id? <Navigate to='/home'/>:<Navigate to='/login'/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/result' element={<Result/>}/>
                {/* <Route path='/register' element={<Register/>}/> */}
                {/* <Route path='/store' element={<MovieStore/>}/> */}
                {/* <Route path='/personal' element={<Personal/>}/>
                <Route path='/details/:id' element={<Details />}/>
                <Route path='/search/:keyword' element={<Search />}/>
                <Route path='/*' element={<NotFound/>}/> */}
            </Routes>

    )
}

export default AppRouter;