import Developer from "../models/developerModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sendgrid from '@sendgrid/mail'
import dotenv from 'dotenv'
dotenv.config()

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export const signup = async(req,res,next) =>{
    const {username, email, password} = req.body
    try {
        if(!username || !email || !password){
            return res.status(400).json({status:400, message:'All fields are required!'})
        }

        let developer = await Developer.findOne({$or:[{username:username},{email:email}]})
        
        if(developer){
            return res.status(400).json({status:400, message:'User already exists'})
        }
        
        const hashedPassword = await bcrypt.hash(password,12)
        
        developer = await Developer.create({
            username:username,
            email:email,
            password:hashedPassword,
        })


        const token = jwt.sign({developer},process.env.TOKEN_SECRET_KEY,{expiresIn:'24h'})

        res.status(200).json({status:200, message:'User signed up successfully', token:token})

        await sendgrid.send({
            to:`${email}`,
            from:'jihadabdlghani73@gmail.com',
            subject:'Email Verification',
            html:`
            <p>Hi there,</p>

            <p>Thank you for signing up for code temple. Click on the link below to verify your email:</p>
            
           <a href='http://localhost:3000/verify-email/?token=${token}'>verify your email</a> 
            
            <p>This link will expire in 24 hours. If you did not sign up for a code temple account,
            you can safely ignore this email.</p>
            
           <p> Best,</p>
            
            <p>The code temple Team</p>
            `
        });
        
    } catch (err) {
        next(err)
    }
}


export const verifyEmail = async(req,res,next) =>{
    const {token} = req.query

    try {
        if(!token){
            return res.status(400).json({status:400, message:"Invalid token!"})
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY)

        const developerId=  decoded._id

        const developer = await Developer
        .findById(developerId)

        if(!developer){
            return res.status(400).json({status:404, message:'User not found'})
        }

        developer.isVerified = true

        await developer.save()

        res.status(200).json({status:200, message:'Email was verified successfully!'})
        
    } catch (err) {
        next(err)
    }

}

export const login = async(req,res,next) =>{
    const {username, password} = req.body

    try {
        if(!username || !password){
            return res.status(400).json({status:400, message:'All fields are required!'})
        }

        let developer = await Developer.findOne({username:username})

        if(!developer){
            return res.status(404).json({status:404, message:'User not found'})
        }

        const match = await bcrypt.compare(password,developer.password)
        if(!match){
            return res.status(400).json({status:400, message:'Incorrect password'})
        }
        const token = jwt.sign({developer},process.env.TOKEN_SECRET_KEY,{expiresIn:'24h'})

        res.status(200).json({status:200, token})

    } catch (err) {
        next(err)
    }
}


export const requestResetPassword = async(req,res,next) =>{
    const {email} = req.body;
    try{
        const developer = await Developer.findOne({email:email});
        if(!developer){
            return res.status(404).json({message:'User not found'});
        }
        const token = jwt.sign({data:developer._id},process.env.RESET_PASSWORD_SECRET_KEY,{expiresIn:'1h'});
        await sendgrid.send({
            to:`${email}`,
            from:'jihadabdlghani73@gmail.com',
            subject:'Reset Password',
            html:`
            <p>Please click on this <a href='http://localhost:3000/set-password/${token}'>Link</a> to reset your password.</p>
            `
        });
        res.status(200).json({message:'Email Sent'});
    }catch(err){
       next(err)
    }
}

export const resetPassword = async(req,res,next) =>{
    const {password,token} = req.body;
    try{ 
        const decoded = jwt.verify(token,process.env.RESET_PASSWORD_SECRET_KEY) 
            if(decoded && password){
        const hashedPassword= await bcrypt.hash(password,12);
        const developer = await Developer.findByIdAndUpdate(decoded.data,{password:hashedPassword});
        return res.status(200).json({developer:developer,message:'Password cahnged successfully!'});
    }
    res.status(400).json({message:'Token is not valid, request new one!'});
}catch(err){
    next(err)
}

}