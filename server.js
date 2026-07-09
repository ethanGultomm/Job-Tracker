import express from "express";

import applicationRoutes from "./routes/application.js";
import authentication from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use("/applications", applicationRoutes);
app.use("/auth", authentication);

app.listen(3000, () => {
    console.log("yo twin server running on port 3000");
})

// endpoints
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});