import httpStatus from "http-status";
import {User} from "../models/usermodel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
const login = async (req,res)=>{
const {username,password}=req.body;

if(!username||!password){
    return res.status(400).json({message:"Please Provide"})
}
try{
    const user = await User.findOne({username});
    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"});
    }
        const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch){ return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }

       const token = crypto.randomBytes(32).toString("hex");/*We send token to the server 
            //👉 Generates a random string (token with no meaning)
            /*stored in DB  .....Server must look it up
....Fully controllable (can delete anytime)*/
user.token=token;
await user.save();
return res.status(httpStatus.OK).json({token: token});

        
    
}catch(e){
    return res.status(500).json({message:`Something went wrong ${e}`});


}
}
const register = async(req,res)=>{
    const {name,username,password}=req.body;
        if (!name || !username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }
            const hashedPassword = await bcrypt.hash(password,10);
    const newUser=new User    (
        {
            name:name,
            username:username,
            password:hashedPassword,
        }
    );
    await newUser.save();
return res.status(httpStatus.CONFLICT).json({ message: "User created" });    
    
    }catch(e){

res.json({message:`Something went wrong ${e}`});
    }
}
export {login , register};