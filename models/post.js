const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
       required:true
    },
    likes: [{ type: Object, ref: 'user' }],
    comments: [
        {
            type: Object,
            postedBy: { type:mongoose.Types.ObjectId, ref: 'user' }
        }
    ],
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
}
,{timestamps:true})
module.exports = mongoose.model("post", postSchema)