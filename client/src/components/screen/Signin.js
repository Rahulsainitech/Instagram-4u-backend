import React,{useState,useContext} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const inputData = (e) => {
        const name = e.target.name
        const value = e.target.value
        return (
            setUser({ ...user, [name]: value })
        )
    }
    // console.log(user)
    const postData =  () => {
        try {
            //email validation
            if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
                return alert("You have entered an invalid email address!")
            }
            const {  email, password } = user
              fetch('/signIn', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                   
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            .then(res=>res.json())
            .then(data=>{console.log(data)
           
            if (data.error) {
                alert(data.error)
            
            } else {
                
                localStorage.setItem("jwt",(data.token))
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                console.log("mytoken",data.token)
                alert("You signed up successfully")
                history('/')
            }})
            .catch(err=>console.log(err))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container signin'>
            <div className="card" >
                <div className="card-body">
                    <h5 className="card-title insta">Instagram</h5>
                    <input
                        name='email'
                        value={user.email}
                        onChange={inputData}
                        type="email"
                        className="form-control my-3"
                        placeholder="email"
                        required
                    />
                    <input
                        name='password'
                        value={user.password}
                        onChange={inputData}
                        type="password"
                        className="form-control my-3"
                        placeholder="password"
                        required />
                    <button type="button" onClick={()=>postData()} className="btn btn-primary my-3">signin</button>
                    <NavLink to='/signup' className="">Don't have an account ?<i class="fas fa-location-arrow"/></NavLink>
                </div>
            </div>
        </div>
    )
}

export default Signin
