import { Router } from "express";
import { userRouter } from "./user";
import { reclaimRouter } from "./reclaim";

export const mainRouter = Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/reclaim', reclaimRouter)