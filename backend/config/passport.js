import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let existingGoogleUser = await User.findOne({ googleID: profile.id });

        
        let existingEmailUser = await User.findOne({ email });

        let user;

        if (existingGoogleUser) {
          
          user = existingGoogleUser;
        } else if (existingEmailUser) {
         
          if (existingEmailUser.googleID) {
            throw new Error("This Google account is already linked to another user.");
          }
          existingEmailUser.googleID = profile.id;
          user = await existingEmailUser.save();
        } else {
        
          user = await User.create({
            name: profile.displayName,
            email,
            googleID: profile.id,
          });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        return done(null, { user, token });

      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

export default passport;