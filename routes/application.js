import { Router } from "express";
import prisma from "../db.js";
import authenticate from "../middleware/auth.js";

const router = Router();
router.use(authenticate);

/// ENDPOINTS
// find applications
router.get("/", async (req, res) =>{
    console.log(req.query);
    const where = {};

    if(req.query.position){
        where.position = {
            contains: req.query.position,
            mode: "insensitive"
        };
    }

    if(req.query.id){
        where.id = {
            contains: req.query.id
        };
    }

    if(req.query.company){
        where.company = {
            contains: req.query.company,
            mode: "insensitive"
        };
    }

    where.userId = { contains: req.user.userId };

    const applications = await prisma.application.findMany({where});
    res.json(applications);
});

// Make an application
router.post("/", async (req, res) => {
    const application = 
        await prisma.application.create({
            data: {
                company: req.body.company,
                position: req.body.position,
                status: req.body.status,
                userId: req.user.userId
            }
        });
    res.status(201).json(application);
});

// Update the status of an application
router.put("/:id", async (req, res) => {
    try{
        const application = await prisma.application.update({
            where: {
                id: req.params.id,
                userId: req.user.userId
            },
            data: {
                status: req.body.status
            }
        });
        res.json(application);
    }
    catch (error){
        if(error.code === "P2025"){
            return res.status(404).json({
                error: "Application doesn't exist twin"
            });
        }
        console.error(error);

        res.status(500).json({
            error: "internal server error"
        });
    }
});

// Delete application
router.delete("/:id", async (req, res) =>{
    try {
        const application =
        await prisma.application.delete({
            where: {
                id: req.params.id,
                userId: req.user.userId
            }
        });
    res.sendStatus(204);
    }
    catch (error){
        if(error.code === "P2025"){
            return res.status(404).json({
                error: "Application doesn't exist twin"
            });
        }
        console.error(error);

        res.status(500).json({
            error: "internal server error"
        });
    }
});

export default router;