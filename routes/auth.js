const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secretKey} = require('../keys')
const middleware = require('../middleware/requireLogin')

router.get('/protected',middleware, (req, res) => {
    res.send("hello I am router")
})
router.post('/signupserver', (req, res) => {
    const { name, email, password,photo } = req.body
    if (!name || !email || !password ) {
        return res.status(422).json({ "error": "please fill all the field properly" })
    }
    User.findOne({ email: email })
        .then((saveUser) => {
            if (saveUser) {
                return res.status(423).json({ "error": "user already exist with this email id" })
            }
            bcrypt.hash(password, 12)
                .then((hasedPassword) => { 
                    const user = new User({
                        name,
                        email,
                        password:hasedPassword,
                        photo
                        
                    })
                    user.save()
                        .then(() => res.status(200).json({ "message": "user signed up successfully" }))
                        .catch((error) => res.status(404).json({ "error": "data not saved" }))
                })
            
        })
        .catch((error) => {
            console.log(error)
        })



})
router.post('/signIn',(req,res)=>{
    const {email,password} = req.body
    if(!email||!password){
        res.status(422).json({"error":"add email or password"})
    }
     User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
           return res.status(423).json({"error":"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id},secretKey)
                const {_id,name,email,following,follower,photo}=savedUser
                res.status(201).json({token,user:{_id,name,email,follower,following,photo}})
                // res.status(201).json({"message":"sign in successfully"})
            }
            else{
                res.status(424).json({"error":"invalid credentionls"})
            }
        })
        .catch((err)=>console.log(err))
      
    })
})
module.exports = router