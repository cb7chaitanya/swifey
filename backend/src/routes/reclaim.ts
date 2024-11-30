import express, { Request, Response, Router } from "express";
import { generateConfig, recieveProofs } from "../controllers/reclaim";

export const reclaimRouter = Router()

reclaimRouter.use(express.text({ type: '*/*', limit: '50mb' }));

reclaimRouter.get('/generate-config', generateConfig)
reclaimRouter.post('/recieve-proofs', recieveProofs)