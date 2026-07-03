import express from "express";
import prisma from "./prisma.js"

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("yo twin server running on port 3000");
})

// endpoints
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.post("/applications", async (req, res) => {
    const application = 
        await prisma.application.create({
            data: {
                company: req.body.company,
                position: req.body.position,
                status: req.body.status
            }
        });
    res.status(201).json(application);
});

// List out all applications
app.get("/applications", async (req, res) => {
    const applications = await prisma.application.findMany();
    res.json(applications);
});

// Get application by ID
app.get("/applications/:id", async (req, res) => {
    const application =
        await prisma.application.findUnique({
            where: {
                id: req.params.id
            }
        });

    if(!application) {
        return res.status(404).json({
            error: "job not found"
        });
    }

    res.json(application);
});

// Update the status of an application
app.put("/applications/:id", async (req, res) => {
    try{
        const application = await prisma.application.update({
            where: {
                id: req.params.id
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
app.delete("/applications/:id", async (req, res) =>{
    const application =
        await prisma.application.delete({
            where: {
                id: req.params.id
            }
        });

    res.sendStatus(204);
});