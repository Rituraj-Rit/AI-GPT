let UserModel = require('../models/user.mode')
let bcrypt = require('bcryptjs')
let jwt = require('jsonwebtoken')
async function RegisterUser(req, res) {
    const {email, fullName:{firstName, lastName}, password} = req.body

    let isUserExist = await UserModel.findOne({email})
    if(isUserExist){
        return res.status(400).json({
            message:"User allready exists"
         })
    }

    let user = await UserModel.create({
        email ,
        fullName:{
            firstName, lastName
        },
        password: await bcrypt.hash(password, 10)
    })

    let token = await jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User resgistered successfully",
        user:{
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}
async function loginUser(req, res){
    let {email, password} = req.body;

    let user = await UserModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    let isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }

    let token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(200).json({
        message:"user logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}
module.exports = {
    RegisterUser,
    loginUser
}