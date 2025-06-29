import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute= async(req,res, next)=>{
    try{
        const token= req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized:No provided token"});
        }
        const check= jwt.verify(token,process.env.JWT_SECRETKEY);
        if(!check){
           return res.status(401).json({message:"Unauthorized:Invalid token"});  
        }
        const user= await User.findById(check.userId).select("-password");
        if(!user){
           return res.status(401).json({message:"No user found"});
        }
        req.user=user;
        next();
      
    }catch(error){
        console.log("Error occured in middleware:",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
}