import React, { useEffect, useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'

const Profile = () => {
    const history = useNavigate()
    const [data, setData] = useState([])
    const [url, setUrl] = useState()
    const [image, setImage] = useState()
    const { state, dispatch } = useContext(UserContext)
    console.log("state", state)
    useEffect(() => {
        fetch("/mypost", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log("data ",result)
                setData(result.myPost)

            })


    }, [])
    const Delaccount = () => {
        fetch(`/user/${state._id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log("result after delete profile", result)
                localStorage.clear()
                dispatch({ type: "CLEAR" })
                history('/signin')

                // window.location.reload()

            })
    }
    const updatepic = () => {

        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "Instaclone")
        data.append("cloud_name", "geeta9812")

        fetch("https://api.cloudinary.com/v1_1/geeta9812/image/upload", {
            method: "POST",
            body: data
        })
            .then((res) => res.json())
            .then(data => {
                console.log("data of image", data)
                setUrl(data.url)

                fetch('/updatepic', {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
                    },
                    body: JSON.stringify({
                        photo: data.url
                    })
                }).then(res => res.json())
                    .then(result => {
                        console.log(result)
                        localStorage.setItem('user', JSON.stringify({ ...state, photo: result.photo }))
                        dispatch({ type: 'UPDATEPIC', payload: result.photo })
                        window.location.reload()
                    })

            })
            .catch(err => { console.log(err) })


    }
    console.log("image is", image)
    useEffect(() => {
        if (image) {
            updatepic()
        }
    }, [image])
    return (
        <div className='container profile'>
            <div className='row d-flex justify-content-center '>
                <div className='col-md-8' >
                    <div className='row ' style={{ borderBottom: '1px solid grey' }}>
                        {state ? <>
                            <div className="input-group mb-3 setting">
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                                        <i class="fas fa-user-cog" />
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <div className="dropdown-item input-group-prepend">
                                            <span className="input-group" id="inputGroupFileAddon01">Update Pic</span>
                                        </div>
                                        <div className="custom-file">
                                            <input type="file" onChange={(e) => setImage(e.target.files[0])} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                                            <label className="custom-file-label d-block" htmlFor="inputGroupFile01"><i class="fas fa-paperclip" /></label>
                                        </div>
                                        <button className="dropdown-itembtn btn-sm btn-outline-danger d-block m-auto " onClick={() => Delaccount()} >Delete Account</button>
                                    </div>
                                </li>

                            </div>
                            <div className='col-12 col-md-5   pic'>
                                <img className=' ' src={state.photo} />
                            </div>
                            <div className='col-md-7 mb-5 mt-4'>

                                <h3 className='text-center text-capitalize col-12 prohead'>{state.name}</h3>
                                <h6 className='text-center col-12'>
                                    <a href={"mailto:" + state.email}>{state.email}</a>
                                </h6>
                                <div className='follow'>
                                    <h6>{data.length} post</h6>
                                    <NavLink to='/myfollower'><h6>{state.follower.length} follower</h6></NavLink>
                                    <NavLink to='/myfollowing'><h6>{state.following.length} following</h6></NavLink>
                                </div>

                            </div>
                        </>
                            : <h2 className='loading' >loading...</h2>}
                    </div>
                    <div className='row gallery mt-3'>
                        {!data? <h4 className='loading' >loading...</h4>:
                        data.map(item => {
                            return (
                                <>
                                <NavLink to={'/#'+item._id} className='col-6 col-md-4 my-2 ' >
                                    <img className='' key={item._id} src={item.photo} alt='img'/>
                                </NavLink>
                                </>
                    )
                        })}


                </div>
            </div>
        </div>

        </div >
    )
}

export default Profile
