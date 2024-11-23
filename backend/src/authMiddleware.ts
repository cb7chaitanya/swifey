import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./conf"

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const header = req.headers.authorization || req.headers.Authorization as string
        if (!header) {
            res.status(401).json({ message: 'Unauthorized, missing headers' })
            return;
        }
        const parts = header.split(' ')
        if(parts.length !== 2 || parts[0] !== 'Bearer'){
            res.json({
                message: "Unauthorized"
            })
            return
        }
        const token = parts[1]
        const verified = jwt.verify(token, JWT_SECRET || 'secret') as JwtPayload
        req.userId = verified.userId
        next()
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: 'Unauthorized' })
        return;
    }
}