import { generatetoken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup= async(req,res)=>{
    const {fullname,email,password}= req.body;
     try{
        if(!fullname || ! email || !password){
          return res.status(400).json({message:"Fill the details completely"});
        }
      if(password.length<8){
        return res.status(400).json({message:"Password must be of 8 characters"});
      }
      const user= await User.findOne({email})
      if(user) return res.status(400).json({message:"User with this email already exists"});

      const salt=await bcrypt.genSalt(10);
      const hashedPassword= await  bcrypt.hash(password,salt);

      const newUser= new User({
        fullname,
        email,
        password:hashedPassword,
      })
      if(newUser){
        generatetoken(newUser._id,res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            email:newUser.email,
            profilePic: newUser.profilePic
        })
        
      }else{
        return res.status(400).json({message:"Invalid user data"})
      }

     }catch(error){
        console.log("Signup error occured",error.message);
        res.status(500).json({message:"Internal Server Error"});
     }
}

export const login= async(req,res)=>{
    const {email,password}= req.body;
    try{
        const user= await User.findOne({email});
        if(!user){
         return res.status(400).json({message:"Invalid data"});
        }

        const isPassword= await bcrypt.compare(password, user.password);
        if(!isPassword){
         return res.status(400).json({message:"Invalid data"});
        }
         generatetoken(user._id,res);
          res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic
         });
    }catch(error){
        console.log("Error occured in login",error.message);
        res.status(400).json({message:"Internal server error"})
    }
};

export const logout=(req,res)=>{
     try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(201).json({message:"Successfully logged out"});
     }catch(error){
         console.log("Error occured in login",error.message);
        return res.status(400).json({message:"Internal server error"});
     }
};

export const updateProfile= async(req,res)=>{
    try{
      const {profilePic}=req.body;
      const userId= req.user._id;
      if(!profilePic){
        return res.status(400).json({message:"Profile picture is required!"});
      }
      const uploadResponse= await cloudinary.uploader.upload(profilePic);
      const updatedUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
      return res.status(200).json(updatedUser);

    }catch(error){
       console.log("Error in profile updation", error.message);
       return res.status(500).json({message:"Internal Server Error"});
    }
};

export const checkAuth= async(req,res)=>{
    try{
       return res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller",error.message);
        return res.status(500).json({nessage:"Internal server error"});
    }
};