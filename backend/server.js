import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import connectDB from "./config/database.js";
import "./config/passport.js";
import authRoutes from "./routes/auth.js";
import session from "express-session";
dotenv.config();
connectDB();
const app=express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true 
}));
app.use(express.json());
app.use(
  session({
    secret: "passportsecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth",authRoutes);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=> console.log(`Server is running on http://localhost:${PORT}`));








