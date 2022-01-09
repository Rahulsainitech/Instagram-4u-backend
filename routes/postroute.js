const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = require("../models/post")
const requireLogin = require('../middleware/requireLogin')
const user = require('../models/user')


router.get('/allpost',requireLogin,async(req,res)=>{
    const data = await Post.find()
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name ")
    .sort('-createdAt')
    res.json({data})
})
router.get('/getsubpost',requireLogin,async(req,res)=>{
    // if postedBy in following
    const data = await Post.find({postedBy:{$in : req.user.following}})
    .populate("postedBy","_id name email photo",)
    .populate("comments.postedBy","_id  name")
    .sort('-createdAt')
    res.json({data})
})

router.get('/getfollowpost',requireLogin,async(req,res)=>{
    // if postedBy in following
    const data = await Post.find({postedBy:{$in : req.user.follower}})
    .populate("postedBy","_id name email photo ")
    .populate("comments.postedBy","_id  name")
    .sort('-createdAt')
    res.json({data})
})

router.get('/mypost',requireLogin,async(req,res)=>{
    const myPost = await Post.find({postedBy:req.user._id})
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name email")
     .sort('-createdAt')
    res.json({myPost})
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,photo} = req.body
    console.log(title,body,photo)
    if(!title||!body||!photo){
        return res.status(422).json({error:"please add all the fields"})
    }
    req.user.password = undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy:req.user
    })

    post.save().then((result)=>{
        res.status(200).json({post:result})
    }).catch((err)=>console.log(err))
    
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user.name
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})

        }else{
            res.json(result)
        }
    })
})

router.delete(`/deletepost/:postId`,requireLogin,(req,res)=>{
    const _id = req.params.postId
    console.log(_id)
    Post.findOne({_id})
    // console.log(Post.find({_id:req.params.postId}))
    .populate("postedBy","_id name")
    .exec((err,Post)=>{
        if(err||!Post){
            console.log(err)
            return res.json({error:err})
        }else if(Post.postedBy._id.toString() === req.user._id.toString()){
            Post.remove({new:true})
            .then(result=>res.json(result))
            .catch(err=>console.log(err))
        }
    }
    )
})

router.put('/follow',requireLogin,(req,res)=>{
    const id = req.body.followId
    console.log(id)
    user.findByIdAndUpdate(req.body.followId,{
        $push:{follower:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err||!result){
            // console.log(result)
            console.log(err)
            return res.status(422).json({error:err})
        }
       
        user.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password")
    .then(result=>{
        console.log(result)
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})
})
router.put('/unfollow',requireLogin,(req,res)=>{
    user.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{follower:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        user.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})
})

module.exports = router