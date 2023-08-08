const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {secretKey} = require('../config/keys')
const middleware = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const user = require('../models/user')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:process.env.twillokey
    }
}))
router.get('/protected',middleware, (req, res) => {
    res.send("hello I am router")
})
router.post('/signupserver', (req, res) => {
    const { name, email, password,photo } = req.body
    if (!name || !email || !password ) {
        return res.status(422).json({ "error": "please fill all the field properly" })
    }
    User.findOne({ email:email })
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
                        .then((user) =>{
                            transporter.sendMail({
                                to:user.email,
                                from:"uietece1923rahul@kuk.ac.in",
                                subject:"signup success",
                                html:`<h1>Welcome 😄 ${user.name} to instagram-4u</h1>
                                <a href='https://mern-rahulsaini-tech.herokuapp.com'>developercontact...</a>`
                            }) 
                            res.status(200).json({ "message": "user signed up successfully" })
                        })
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

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString('hex')
        user.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                res.status(422).json({error:"user not exist with this email id please signup first"})
            }
            user.resetToken = token
            user.expireToken = Date.now()+3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"uietece1923rahul@kuk.ac.in",
                    subject:"password reset",
                    html:`<p>Hello ${user.name} You requested for password reset</p>
                    <h5>click on this <a href="https://instagram-4u.herokuapp.com/reset/${token}">link...</a></h5>`
                })
                res.status(201).json({message:"check your email"})
            })
        })
    })
})
router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    console.log(newPassword,sentToken)

    user.findOne({resetToken: sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
        return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashpassword=>{
          user.password = hashpassword
          user.resetToken = undefined
          user.expireToken= undefined
          user.save().then((savedUser)=>{
              res.json({message:"password updated success"})
          })  
        })
    }).catch(err=>{
        console.log(err)
    })
})
module.exports = router