import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

import path from "path";

import { app, server } from "./lib/socketio.js";
dotenv.config();
const PORT=process.env.PORT;

const __dirname= path.resolve();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoute);



if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/*",(req,res)=>{
       res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB();
});