import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

 const BASE_URL=import.meta.env.MODE==="development"? "http://localhost:5001":"/";

export const useAuthStore= create((set, get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false, 
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,


     checkAuth: async ()=>{
        try{
            const res= await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            get().connectSocket();
        }catch(error){
            console.log("Error in checkAuth:" ,error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
     },

     login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      const message = error.response?.data?.message;// check whats the issue
        // toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

     signup: async(data)=>{
        set({isSigningUp: true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});
            toast.success("Account created Successfully");
            get().connectSocket();
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isSigningUp: false});
        }
     },

     updateProfile: async(data)=>{
       set({isUpdatingProfile:true});
       try{
         const res= await axiosInstance.put("/auth/updateProfile", data);
         set({authUser: res.data});
         toast.success("Profile updated successfully");
       }catch(error){
          toast.error("Error in update profile: ",error);
       }finally{
        set({isUpdatingProfile:false});
       }
     },

     logout:async()=>{
       try{
        await axiosInstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logged Out succesfully!");
        get().disconnectSocket();
       }catch(error){
          toast.error(error.response.data.message);
       }  
     },

     connectSocket:()=>{
      const {authUser}= get();
      if(!authUser || get().socket?.connected) return;
       const socket= io(BASE_URL,{
        query:{
          userId:authUser._id,
        },
       });
       socket.connect();
       set({socket:socket});

       socket.on("getOnlineUsers",(userIds)=>{
          set({onlineUsers:userIds});
       });
     },

     disconnectSocket:()=>{
      if(get().socket?.connected) get().socket.disconnect();
     },
}));