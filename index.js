const express = require('express')
const app = express();
const port = process.env.PORT || 5000;
const {keys}=require('./config/keys')
const mongoose = require('mongoose')
const router = require('./routes/auth')
const cors=require('cors')
require('./models/user')
require('./models/post')
// mongoose.model('user')
app.use(cors())
app.use(express.json())
app.use(router)
app.use("/api/posts",require('./routes/postroute'))
app.use("/api/users",require('./routes/user'))

mongoose.connect(keys)
.then(()=>{console.log('connection is successfull')})
.catch((error)=>{console.log(error)})

if(process.env.NODE_ENV==="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})