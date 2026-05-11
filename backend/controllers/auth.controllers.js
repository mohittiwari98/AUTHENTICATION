import generateToken from "../config/token.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userName } = req.body;
    
    // 1. Check if all fields are filled
    if (!firstName || !lastName || !email || !password || !userName) {
      return res.status(400).json({ message: "Please fill all details" });
    }

    // 2. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      userName
    });

    // 5. Make token
    let token = generateToken(user._id);

    // 6. Send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",   // S must be capital S
      secure: false,        // set true only on https
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });

    // 7. Remove password before sending user back
    user.password = undefined;

    return res.status(201).json({ message: "User created", user });
    
  } catch (e) {
    return res.status(500).json({ message: "Error in signup" });
  }
}
