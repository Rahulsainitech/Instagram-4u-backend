const jwt = require('jsonwebtoken')
const {secretKey}= require('../config/keys')
const user = require('../models/user')
module.exports = (req,res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        res.status(401).json({error:"YOu must be logged In "})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,secretKey,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in "})
        }

        const {_id} = payload
        user.findById(_id).then((userData)=>{
            req.user = userData
            next()
        })
    })
}