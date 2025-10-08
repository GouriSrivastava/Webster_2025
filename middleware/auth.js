import jwt from "jsonwebtoken";

const auth= (req,res,next) => {
    const header= req.headers["authorization"];
    if (!header) return res.status(401).json({error: "No token provided"});
    const token=header.startsWith("Bearer ") ? header.split(" ")[1] : header;
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        next();
    }
    catch  (err){
        return res.status(401).json({error: "Invalid or expired token"})
    }
}
export default auth;