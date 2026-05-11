import generateToken from "../config/token.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userName } = req.body;
    if (!firstName || !lastName || !email || !password || !userName) {
      return res.status(400).json({ message: "please fill each details" });
    }
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already existed" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedpassword,
      userName
    });
    let token=generateToken(user._id);
    return res.status(201).json({ message: "User created", user });
  } catch (e) {
    return res.status(400).json({ message: "Error in signup" });
  }
}
