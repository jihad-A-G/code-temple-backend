import Developer from '../models/developerModel.js'
import  jwt  from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authenticate = async(req,res,next) =>{
    const token = req.headers['authorization']
    try {

        if(!token){
            return res.status(401).json({status:401, message: 'Invalid token!'})
        }
        const decoded =  jwt.verify(token.split(' ')[1], process.env.TOKEN_SECRET_KEY)

        console.log(decoded);

        if(!decoded){
            return res.status(401).json({status:401, message:'User not found'})
        }

        req.developer = decoded
        next()
    } catch (err) {
        next(err)
    }
    
}

export default authenticate