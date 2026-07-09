import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    // check for authentication
    if(!authHeader){
        return res.status(401).json({ error: "you need authentication twin" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // save the user info
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(401).json({error: "invalid or expired token twin"});
    }
}