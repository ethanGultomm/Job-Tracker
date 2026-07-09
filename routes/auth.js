import {Router} from "express";
import bcrypt from "bcrypt";
import prisma from "../db.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: "user created twin",
            email: user.email,
            userId: user.id
        });
    }
    catch (err){
        return res.status(409).json({error: "this email is already registered twin"});
    }
});

router.post("/login", async (req, res) =>{
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    });

    if (!user){
        return res.status(401).json({error: "invalid email or password"});
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (validPassword){
        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );
        
        res.status(200).json({token});
    }
    else{
        return res.status(401).json({error: "invalid email or password"});
    }
});


export default router;