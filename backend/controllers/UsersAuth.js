import bcrypt from "bcryptjs";
import Users from "../models/users.js";
import { newUsersValidation, loginValidation } from "../validation/validation.js";
import jwt from "jsonwebtoken";

// register user

export const newUser = async (req, res) => {
      const {error, value} = newUsersValidation(req.body);
      if(error) return res.status(400).json({message: error.details.map((err) => err.message).join(', ')});

    try{
        const existingUser = await Users.findOne({ email: value.email });
        if(existingUser) return res.status(400).json({message: "User already exists with this email"});

        const hashedPassword = await bcrypt.hash(value.password, 10);

        const newUser = new Users({
            name: value.name,
            email: value.email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } 
    catch (err){
        res.status(500).json({message: err.message, stack: err.stack});
    }

};

export const loginUser = async (req, res) => {
    const {error, value} = loginValidation(req.body);
    if(error) return res.status(400).json({message: error.details.map((err) => err.message).join(', ')});

    try{
        const user = await Users.findOne({ email: value.email });
        if(!user) return res.status(400).json({message: "Invalid email or password"});
        
        const isPasswordValid = await bcrypt.compare(value.password, user.password);
        if(!isPasswordValid) return res.status(400).json({message: "Invalid email or password"});

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });
    }
    catch (err){
        res.status(500).json({message: err.message, stack: err.stack});
    }

};