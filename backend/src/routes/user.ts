import { Router } from "express";
import { profileCreation, reclaimVerification, signin } from "../controllers/user";
import { authMiddleware } from "../authMiddleware";

export const userRouter = Router()

userRouter.post('/profile-creation', profileCreation)
userRouter.post('/signin', signin)
userRouter.put('/reclaimVerification', authMiddleware, reclaimVerification)
userRouter.put('/stakeSol', authMiddleware)