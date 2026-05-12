import generateToken from "../config/token.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userName } = req.body;
    
    if (!firstName || !lastName || !email || !password || !userName) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    // Check both email and userName
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userName
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // true on https
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json({ message: "User created", user: userResponse });
    
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error in signup" });
  }
}

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Use findOne, not find
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Use existUser, not user
    const token = generateToken(existUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: existUser._id,
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        email: existUser.email,
        userName: existUser.userName
      }
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error in login" });
  }
}
export const logout = async (req, res) => {
  try{
  res.clearCookie("token");
    return res.status(200).json({ message: "logout successfully" });
  }catch(e){
    console.error(e);
    return res.status(500).json({ message: "Error in logout" });
  }
}
