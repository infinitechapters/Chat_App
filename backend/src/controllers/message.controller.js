import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId ,io} from "../lib/socketio.js";

export const getUsers= async(req, res)=>{
    try{
        const loggedinUser_id= req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedinUser_id}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(error){
      console.log("Error occured in message_Controller",error.message);
      res.status(500).json({message:"Internal Server Error"});
    }
};

export const getMessages= async(req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId= req.user._id;

        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ],
        })
        return res.status(200).json(messages);
    }catch(error){
        console.log("Error occured in message controller",error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
};

export const sendMessages= async(req,res)=>{
    try{
        const {id:receiverId}= req.params;
        const senderId= req.user._id;
        const {text,image}= req.body;

        let imageUrl;
        if(image){
        const uploadResponse= await cloudinary.uploader.upload(image);
        imageUrl= uploadResponse.secure_url;
        }
        const newMessage= new Message({
          receiverId,
          senderId,
          text,
          image:imageUrl
        })
        await newMessage.save();
      
        const receiverSocketId= getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(200).json(newMessage);

    }catch(error){
        console.log("Error occured in message controller",error.message);
         res.status(500).json({message:"Internal Server Error"});
    }
}