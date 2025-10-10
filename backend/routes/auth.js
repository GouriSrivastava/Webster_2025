import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import User from "../models/user.js";

const router=express.Router();
const generateToken=(userID) => {
    return jwt.sign({userID},process.env.JWT_SECRET,{expiresIn: "1d"})
};

router.post("/signup",async(req,res) => {
    try {
        
        const {email, password} = req.body;
        if (!email || !password) 
            return res.status(400).json ({message: "Email and password required"});
        const existing= await User.findOne({email: email.toLowerCase().trim()});
        if (existing) return res.status(400).json ({message: "User already exists! Try logging in"});

        const passwordHash=await bcrypt.hash(password,10);
        const user=new User({
            email: email.toLowerCase().trim(),
            passwordHash:passwordHash
        });
        await user.save();
        
const token = generateToken(user._id);
return res.status(201).json({
  message: "User registered!",
  token,
  user: { id: user._id, email: user.email }
});

        
    } 
    catch (error) {
         console.error("Signup error: ",error);
         if (error.code==11000) return res.status(400).json({error: "Email already in use"});
         return res.status(500).json({error: "Server error"});

    }

});

router.post("/login", async(req,res) => {
    try {
        const {email,password} =req.body;
        if (!email||!password) return res.status(400).json ({message: "Email and Password required"});
        const user= await User.findOne({email: email.toLowerCase().trim()});
        if (!user) return res.status(400).json({message: "User not found"});
        if (!user.passwordHash) {
            return res.status(400).json({message: "Account registered with Google. Try Google Sign-In"})
        }
        const isMatch=await bcrypt.compare(password,user.passwordHash);
        if (!isMatch) return res.status(400).json({message: "Invalid Credentials"});
        const token=generateToken(user._id);
        return res.json({
            token,
            user: {id:user._id, email: user.email}
        });
    }
    catch (err) {
        console.error("Login error: ",err);
        return res.status(500).json({error: "Server error"});
    }
});

router.get("/google",passport.authenticate("google", {scope: ["profile","email"]}));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

import auth from "../middleware/auth.js"
router.get("/me",auth, async(req,res)=> {
    try {
        const user=await User.findById(req.userID).select("-passwordHash -__v");//check
        if (!user) return res.status(404).json({message:"User not found"});
        return res.json({user});
          }
    catch (err) {
        console.error ("User error : ", err);
        return res.status(500).json({error: "Server error"});
    }
});
export default router;





