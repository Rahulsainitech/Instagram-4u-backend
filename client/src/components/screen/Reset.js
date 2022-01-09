import React,{useState,useContext} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const Reset = () => {
    // const {state,dispatch} = useContext(UserContext)
    const history = useNavigate()
    const [user, setUser] = useState({
        email: ""
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
            const {  email } = user
              fetch('/reset-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                   
                },
                body: JSON.stringify({
                    email
                })
            })
            .then(res=>res.json())
            .then(data=>{console.log(data)
           
            if (data.error) {
                alert(data.error)
            
            } else {
                console.log("mytoken",data.token)
                alert(data.message)
                history('/signin')
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
                    
                    <button type="button" onClick={()=>postData()} className="btn btn-primary my-3">reset password</button>
                    {/* <NavLink to='/signup' className="">Don't have an account ?<i class="fas fa-location-arrow"/></NavLink> */}
                </div>
            </div>
        </div>
    )
}

export default Reset
