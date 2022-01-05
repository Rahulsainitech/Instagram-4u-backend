import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { NavLink, useParams } from 'react-router-dom'

const UserProfile = () => {
    const { userid } = useParams()
    // console.log(userid)
    const [userprofile, setUserprofile] = useState('')
    const { state, dispatch } = useContext(UserContext)
    const [showfollower, setShowFollower] = useState(true)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log("result from user profile", result)
                // setData(result.data)
                setUserprofile(result)
                setShowFollower(result.user.following.include(userid))

            })

    }, [state])
    const Follower = (userid) => {
        fetch('/follow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, follower: data.follower } })
                localStorage.setItem("user", JSON.stringify(data))
                setShowFollower(true)
            })

    }
    const unfollower = (userid) => {
        fetch('/unfollow', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId: userid
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data)
                dispatch({ type: "UPDATE", payload: { following: data.following, follower: data.follower } })
                localStorage.getItem("user", JSON.stringify(data))
                setShowFollower(false)
            })
    }

    return (
        <>
            {userprofile ?
                <div className='container profile'>
                    <div className='row d-flex justify-content-center my-4'>
                        <div className='col-md-8' >
                            <div className='row ' style={{ borderBottom: '1px solid grey' }}>
                                <div className='col-12 col-md-4 mb-5 pic'>
                                    <img src={userprofile.user.photo} />
                                </div>
                                
                                <div className='col-md-6 mb-5'>
                                    <h3 className='text-center col-12 text-capitalize'>{userprofile.user.name}</h3>
                                    <h6 className='text-center col-12'>
                                        <a href={'mailto' + ':' + userprofile.user.email}>{userprofile.user.email}</a>
                                    </h6>
                                    <div className='follow'>
                                        <h6>{userprofile.data.length} post</h6>
                                        <h6>{userprofile.user.follower.length} follower</h6>
                                        <h6>{userprofile.user.following.length} following</h6>
                                    </div>
                                </div>
                                <div style={{ marginLeft: 'auto' }} className='col-md-2'>
                                    {showfollower ?
                                        <button
                                            className='btn btn-sm btn-primary'
                                            onClick={() => unfollower(userid)}>
                                            unfollow
                                        </button> :
                                        <button
                                            className='btn btn-sm btn-primary'
                                            onClick={() => Follower(userid)}>
                                            follow
                                        </button>}
                                </div>
                            </div>
                            <div className='row gallery mt-3'>
                                {userprofile.data.map(item => {
                                    return (
                                        <>
                                            <img className='col-6 col-md-4 my-2' key={item._id} src={item.photo} />
                                        </>
                                    )
                                })
                                }


                            </div>
                        </div>
                    </div>

                </div>
                :
                <h3 className='text-center d-flex justify-content-center' >loading...</h3>}
        </>

    )
}

export default UserProfile
