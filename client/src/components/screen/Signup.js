import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const Signup = () => {
    const history = useNavigate()
    const [url, setUrl] = useState()
    const [image, setImage] = useState()
    const [user, setUser] = useState({
        name: "",
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
    const uploadPic = async () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Instaclone")
        data.append("cloud_name", "geeta9812")

        await fetch("https://api.cloudinary.com/v1_1/geeta9812/image/upload", {
            method: "POST",
            body: data
        })
            .then((res) => res.json())
            .then(data => {
                console.log("this is my ", setUrl(data.url))
            })
            .catch(err => { console.log(err) })
    }

    useEffect(() => {
        if(url){
            uploadField()
        }
    }, [url])

    const uploadField = () => {
        //email validation
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) {
            return alert("You have entered an invalid email address!")
        }
        try {
            const { name, email, password } = user
             fetch('/signupserver', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    photo:url

                })
            })
            .then(res=>res.json())
            .then(result=>{
                if (result.error) {
                    alert(result.error)
                } else if (result.message) {
                    alert(result.message)
                    history('/signin')
                }
            })
            
        } catch (error) {
            console.log(error)
        }
    }
    const postData = async () => {
        if (image) {
            uploadPic()
        } else {
            uploadField()
        }

    }
    return (
        <div className='container signin'>
            <div className="card" >
                <div className="card-body">
                    <h5 className="card-title insta">Instagram</h5>
                    <input
                        name='name'
                        value={user.name}
                        onChange={inputData}
                        type="text"
                        className="form-control my-3"
                        placeholder="name"
                        required
                    />
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
                    <label htmlFor="pic">Upload Pic</label>
                    <input
                        type="file"
                        id='pic'
                        placeholder="upload from device"

                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <button onClick={() => postData()} type="button" id="liveToastBtn" className="btn btn-primary my-3">signup</button>
                    <NavLink to='/signin' className="">Already have an account ?<i className="fas fa-location-arrow" /></NavLink>
                </div>
            </div>


        </div>
    )
}

export default Signup
