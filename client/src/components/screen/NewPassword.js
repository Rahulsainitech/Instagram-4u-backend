import React,{useState,useContext} from 'react';
import { NavLink, useNavigate,useParams } from 'react-router-dom';
import { UserContext } from '../../App';

const NewPassword = () => {
    const {token}= useParams()
    console.log(token)
    const {state,dispatch} = useContext(UserContext)
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
           
            const {password } = user
              fetch('/new-password', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    password,
                    token
                })
            })
            .then(res=>res.json())
            .then(data=>{console.log(data)
           
            if (data.error) {
                alert(data.error)
            
            } else {
                dispatch({type:"USER",payload:data.user})
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
                        name='password'
                        value={user.password}
                        onChange={inputData}
                        type="password"
                        className="form-control my-3"
                        placeholder="create new password"
                        required />
                    <button type="button" onClick={()=>postData()} className="btn btn-primary my-3">update password</button>
                    <NavLink to='/signup' className="">Don't have an account ?<i class="fas fa-location-arrow"/></NavLink>
                </div>
            </div>
        </div>
    )
}

export default NewPassword;
