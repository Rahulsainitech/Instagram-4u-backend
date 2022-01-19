const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require("../models/post")
const User = require("../models/user")
const requireLogin = require('../middleware/requireLogin')
const user = require('../models/user')

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name")
                .populate("comments.postedBy", "_id name")
                .exec((err, data) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    }
                    console.log(user, data)
                    res.json({ user, data })
                })
        }).catch(err => {
            return res.status(404).json({ error: err })
        })
})

router.delete('/user/:id', requireLogin, (req, res) => {
    const id =req.params.id
    console.log(id)
    User.findOneAndDelete({ _id: req.params.id })
        .then(user => {
            console.log(user)
            res.json({ user })
        }).catch(err => {
            console.log(err)
            return res.status(404).json({ error: err })
        })
})
router.put('/updatepic', requireLogin, (req, res) => {
    user.findOneAndUpdate({ _id: req.user._id }, { $set: { photo: req.body.photo } }, { new: true },
        (err, result) => {
            if (err) {
                res.status(433).json({ error: err })
            }
            res.status(201).json(result)
        })
})

router.get('/getsubpost',requireLogin,async(req,res)=>{
    // if postedBy in following
    const data = await user.find({_id:req.user._id})
    .populate("following")
    console.log(data)
    res.json({data})
})

router.get('/getfollowpost',requireLogin,async(req,res)=>{
    // if postedBy in following
    const data = await user.find({_id:req.user._id})
    .populate("follower")
    res.json({data})
})
module.exports = router