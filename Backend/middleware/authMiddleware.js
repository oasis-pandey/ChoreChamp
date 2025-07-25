import jwt from "jsonwebtoken";
import User from "../models/User.js"
import dotenv from "dotenv"

const protect = async (req, res, next) => {
    try{
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.slice(7)
        // decodes the token and gives a js object, 
        // {
        // id: '650ab123cd456ef789...',
        // iat: 1721390000,
        // exp: 1721994800
        // }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) 
        const user = await User.findById(decoded.id).select("-password")
        req.user = user;
        next()
    }else{
        return res.status(401).json({message: "missing token"})
    }
    }catch(err){
        return res.status(401).json({message : "invalid token"})
    } 
}

export default protect;