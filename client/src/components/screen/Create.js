import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Create = () => {
    const history = useNavigate()
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [image, setimage] = useState('')
    const [url, setUrl] = useState('')

    useEffect(() => {
       if(url){
         fetch('/createpost', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                title,
                body,
                photo:url
               
            })
        })
        .then(res=>res.json())
        .then(postdata=>{console.log(postdata)
        if (postdata.error) {
            alert(postdata.error)
        } 
        else {
            alert("post added successfully")
            history('/')
        }
    })
       }
    }, [url])

    const postDetails = async() => {
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
    
    
    return (
        <div className='container create'>
            <div className="card" style={{ width: '36rem' }}>
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control my-3"
                        placeholder="Add title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control my-3"
                        placeholder="description"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                    <input
                        type="file"
                        className="form-control"
                        placeholder="upload from device"
                      
                        onChange={(e) => setimage(e.target.files[0])}
                    />
                    
                    <button
                        type="button "
                        onClick={() => postDetails()}
                        className="btn btn-primary">Send Post
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Create;
