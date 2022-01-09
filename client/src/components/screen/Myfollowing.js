import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { NavLink } from 'react-router-dom'



const Myfollowing = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/getsubpost', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('jwt')
            }
        })
            .then((res) => res.json())
            .then(result => {
                console.log("mypost data is", (result.data))
                console.log(result)
                setData(result.data)
            }).catch(err=>console.log(err))
    }, [])
    
    return (

        <div className='container home myfollowing'>
            {
                data.map((item) => {
                    const { postedBy } = item
                    return (<>
                        <div className="col-12 card mb-3" style={{maxWidth: '600px'}} id={postedBy._id}>
                            <div className="row no-gutters">
                                <div className="col-3 col-md-4 ">
                                    <img src={postedBy.photo} alt="..." />
                                </div>
                                <div className="col-6 col-md-5">
                                    <div className="card-body">
                                        <h5 className=" card-title text-capitalize">{postedBy.name}</h5>
                                        <p className=""> {postedBy.email}</p>
                                    </div>
                                </div>
                                <div className='col-3 col-md-3'>
                                    <NavLink  to={state._id===postedBy._id?'/profile':'/profile/' + postedBy._id}>visit profile<i class="fas fa-location-arrow px-3" /></NavLink>
                                </div>
                            </div>
                        </div>

                       
                    </>
                    )
                })
            }
        </div>

    )
}

export default Myfollowing;
