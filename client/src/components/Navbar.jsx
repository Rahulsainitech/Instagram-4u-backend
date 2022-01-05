import React, { useContext } from 'react'
import { NavLink,useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

const Navbar = () => {
    const history = useNavigate()
    const { state, dispatch } = useContext(UserContext)
    const renderList = () => {
        if (state) {
            return [<li className="nav-item">
                <NavLink className="nav-link " to='/' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Home"><i class="fas fa-home"></i></NavLink>
            </li>,
            <li className="nav-item">
                <NavLink className="nav-link" to='/create' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add Post"><i class="far fa-plus-square"></i></NavLink>
            </li>,
            <li className="nav-item">
                <NavLink className="nav-link" to='/profile' data-bs-toggle="tooltip" data-bs-placement="bottom" title="User Profile"><i style={{borderRadius:'50%',padding:'4px',fontSize:'1rem',border:'2px solid black'}} class="fas fa-user" /></NavLink>
            </li>,
            <li className="nav-item">
             <button type="button"
             onClick={()=>{
                 localStorage.clear()
                 dispatch({type:"CLEAR"})
                 history('/signin')
             }}
              className="btn btn-sm btn-outline-danger my-3">
              Logout
              </button>
        </li>,
            ]
        } else {
            return [
                <li className="nav-item ">
                <NavLink className="nav-link" to='/signin' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Sign In"><i class="fas fa-sign-in-alt" /></NavLink>
            </li>,
            <li className="nav-item">
                <NavLink className="nav-link" to='/signup' data-bs-toggle="tooltip" data-bs-placement="bottom" title="Sign Up"><i class="fas fa-user-plus" /></NavLink>
            </li>
            ]
        }
    }
    return (
        <>
            <div className='container'>
                <nav className="navbar navbar1 fixed-top  navbar-light bg-white">
                    <NavLink className="navbar-brand col-3  insta" to={state?"/":"/signin"}>Instagram</NavLink>
                    {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button> */}
                    <div className="navbar" id="">
                        <ul className="navbar nav1 ">

                    {renderList()}
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Navbar
