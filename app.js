
const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const PORT = process.env.PORT || 5000
// Importing models
const User = require('./models/user')
const Todo = require('./models/todo')
const user = require('./models/user')
const { MONGO_URL , JWT_SECRET} = require('./config/keys')

const app = express()

mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', (err)=>{
    if(!err){
        console.log('DB connected Successfully')
    }
    else{
        console.log(err, 'error in connecting db')
    }
})

 
app.use(express.json())



const requireLogin = (req, res,next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "You must be logged in"})
    }
   try{
        const {userId} = jwt.verify(authorization, JWT_SECRET)
        req.user = userId
        next()
   }
   catch(err){
    return res.status(401).json({error: err})//"You must be logged in"
   }
}


// Signup Post Method
app.post('/signup', async (req, res) => {
    const {email, password} = req.body
    console.log(req.body)
    try{
        if(!email || !password){
            return res.status(422).json({error:"Please add all the fields"})
         }
         const user = await User.findOne({email})
         if(user){
            return res.status(422).json({error:"email already exist"})
         }
         const hashedPassword = await bcrypt.hash(password, 12)
         await new User({
             email,
             password: hashedPassword
         }).save()
         res.status(200).json({message:"signup success you can login now"})
    }
    catch(err){
        console.log(err)
    }
})

//Sign_in post Method
app.post('/signin', async(req, res) => {
    const {email, password} = req.body
    console.log(req.body)
    try{
        if(!email || !password){
            return res.status(422).json({error:"Please add all the fields"})
         }
         const user = await User.findOne({email})
         if(!user){
            return res.status(422).json({error:"email doesn't exist"})
         }
         const doMatch = await bcrypt.compare(password, user.password)
         console.log(doMatch)
         if(doMatch){
            const token = jwt.sign({userId:user._id}, JWT_SECRET)
            res.status(201).json({token})
         }
         else{
            return res.status(401).json({error:"email or password is wrong"})
         }
    }
    catch(err){
        console.log(err)
    }
})

app.post('/createtodo', requireLogin, async (req, res) => {
    console.log(req.body)
   const data = await new Todo({
        todo:req.body.todo,
        todoBy: req.user
    }).save()

    res.status(201).json({message:data})
    }) 

    app.get('/gettodos', requireLogin, async(req, res, err) => {
       const data = await Todo.find({
            todoBy: req.user
        })
        res.status(200).json({message:data})
        console.log(data)
    })

    app.put('/update/:id', requireLogin, async (req , res) => {
        const filter = {_id : req.params.id}
        console.log(req.body)
        const update = {$set : {todo: req.body.todo}}
        console.log(filter, update)
         
        await Todo.updateOne(filter, update, (err)=>{
            if(!err){
                console.log('Update successfully')
            }
            else{
                console.log(err)
            }
        })
        const data = await Todo.find({
            todoBy: req.user
        })
        res.status(200).json({message:data})

    })

    app.delete('/remove/:id',requireLogin, async(req, res, err)=> {
        const data = await Todo.findOneAndRemove({
            _id:req.params.id
        }) 
        res.status(200).json({message:data}) 
        
    })
    if(process.env.NODE_ENV === 'production'){
        const path = require('path')
        app.get('/', (req, res) => {
            app.use(express.static(path.resolve(__dirname, "client", "build")))
            res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
        })

    }

app.listen(PORT, () => {
    console.log('Server running on', PORT)
})



