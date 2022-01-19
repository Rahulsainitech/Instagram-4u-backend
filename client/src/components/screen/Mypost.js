import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { NavLink } from 'react-router-dom'

const Mypost = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/mypost', {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then((res) => res.json())
            .then(result => {
                console.log("mypost data is", result.myPost)

                setData(result.myPost)
            })
    }, [])

    const likepost = (id) => {
        fetch('/like', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return (result)
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch((err) => console.log(err))
    }

    const unlikepost = (id) => {
        fetch('/unlike', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return (result)
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch((err) => console.log(err))
    }
    const makecomment = (text, postId) => {
        console.log("text and postId", text, postId)
        fetch('/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({ text, postId })
        }).then(res => res.json())
            .then(result => {
                console.log("comments", result)

                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err =>
                console.log(err))

    }
    const deletepost = (postId) => {
        console.log(postId)
        fetch(`/deletepost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return (item._id !== result._id)
                })
                setData(newData)
            })
            .catch(err => console.log(err))
    }

    return (

        <div className='container home'>
            {!data? <h2 className='loading' >loading...</h2>:
                data.map((item) => {
                    const { postedBy, photo, body, likes, title } = item
                    return (
                        <div className="card" key={item._id} id={item._id} style={{ width: '36rem' }}>
                            <h6 style={{ position: 'relative' }} >

                                <NavLink
                                    to={state._id === postedBy._id ? '/profile' : '/profile/' + postedBy._id}>
                                    <img className='postimage' src={postedBy.photo} alt="img" />
                                    {postedBy.name}
                                    <i class="fas fa-location-arrow px-3" />
                                </NavLink>

                                {(item.postedBy._id === state._id) &&
                                    <i onClick={() => deletepost(item._id)} style={{ position: 'absolute', cursor: 'pointer', right: '10px', top: '8px', color: 'red', fontSize: '1.4rem' }}
                                        class="fas fa-trash-alt" />
                                }
                            </h6>
                            {
                                <img
                                    src={photo} key={item._id} onDoubleClick={item.likes.includes(state._id) ? () => unlikepost(item._id) : () => likepost(item._id)}
                                    className="card-img-top" alt={title} />
                            }
                            <div className="card-body">
                                {item.likes.includes(state._id) ?
                                    <i className="fas fa-heart"
                                        style={{ color: 'red', fontSize: '1.8rem' }}
                                        onClick={() => unlikepost(item._id)}
                                    ></i>
                                    :
                                    <i className="far fa-heart"
                                        style={{ color: 'black', fontSize: '1.3rem', paddingRight: '1rem' }}
                                        onClick={() => likepost(item._id)}
                                    />
                                }

                                <h6>{likes.length} likes</h6>
                                <h6 className="card-title">{title}</h6>
                                <p className="card-text">{body}</p>
                                {item.comments.map(record => {
                                    return (
                                        <p key={record._id}>
                                            <span style={{ fontWeight: "500" }}>{record.postedBy} </span>
                                            {record.text}
                                        </p>
                                    )
                                })}
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makecomment(e.target[0].value, item._id)
                                    e.target[0].value = ''
                                }}>
                                    <input type="text"
                                        className="form-control my-3"
                                        placeholder="Add a comment..."
                                        aria-label="Username" />

                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>

    )
}

export default Mypost
