import React, { useEffect, createContext, useReducer, useContext } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, useNavigate, BrowserRouter, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './components/screen/Home';
import Signin from './components/screen/Signin';
import Signup from './components/screen/Signup';
import Profile from './components/screen/Profile';
import UserProfile from './components/screen/UserProfile';
import Create from './components/screen/Create';
import './index'
import { reducer, initialState } from './reducers/userReducer';
import Myfollopost from './components/screen/Myfollowpost';
import Suserpost from './components/screen/Suserpost';
import Myfollowing from './components/screen/Myfollowing';
import Myfollower from './components/screen/Myfollower';
import Reset from './components/screen/Reset';
import NewPassword from './components/screen/NewPassword';
import Mypost from './components/screen/Mypost';
export const UserContext = createContext()

const Routing = () => {
    const history = useNavigate()
    const location = useLocation()
    const {state,dispatch} = useContext(UserContext)
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        console.log("type of user is",typeof(user),user)
        if (user) {
            dispatch({type:"USER",payload:user})
            // history('/')
        } else {
            if(!location.pathname.startsWith('/reset'))
            history('/signin')
        }

    }, [])
    return (
        <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/myallpost' element={<Mypost />} />
            <Route  path='/signin' element={<Signin />} />
            <Route  path='/signup' element={<Signup />} />
            <Route  path='/create' element={<Create />} />
            <Route  path='/myfollowpost' element={<Myfollopost />} />
            <Route  path='/userpost/:userid' element={<Suserpost />} />
            <Route  path='/profile' element={<Profile />} />
            <Route  path='/myfollower' element={<Myfollower />} />
            <Route  path='/myfollowing' element={<Myfollowing />} />
            <Route exact path='/reset' element={<Reset/>} />
            <Route exact path='/reset/:token' element={<NewPassword/>} />
            <Route exact path='/profile/:userid' element={<UserProfile />} />
        </Routes>

    )
}
const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <>
            <UserContext.Provider value={{ state, dispatch }}>
                <BrowserRouter>
                    <Navbar />
                    <Routing />
                </BrowserRouter>
            </UserContext.Provider>

        </>
    )
}

export default App
