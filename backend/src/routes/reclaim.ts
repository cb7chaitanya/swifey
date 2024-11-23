import { Request, Response, Router } from "express";
import { generateConfig, recieveProofs } from "../controllers/reclaim";

export const reclaimRouter = Router()

reclaimRouter.get('/generate-config', generateConfig)
reclaimRouter.post('/recieve-proofs', recieveProofs)