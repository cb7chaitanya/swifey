import { Request, Response } from "express";
import { ReclaimProofRequest } from "@reclaimprotocol/js-sdk"
import { APP_ID, APP_SECRET, PROVIDER_ID } from "../conf";

export const generateConfig = async(req: Request, res: Response) => {
    try { 
        if(!APP_ID || !APP_SECRET || !PROVIDER_ID){
            res.status(400).json({
                message: "Reclaim configuration is not properly set"
            })
            return
        }
        const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID)
        reclaimProofRequest.setAppCallbackUrl('http://localhost:3000/api/v1/recieve-proofs')
        const reclaimProofRequestConfig = reclaimProofRequest.toJsonString()
        res.json({
            reclaimProofRequestConfig
        })
        return 
    } catch(error) {
        console.error('Error generating request config', error)
        res.status(500).json({
            error: "Failed to generate config"
        })
        return
    }
}

export const recieveProofs = async(req:Request, res:Response) => {
    const proofs = req.body
    console.log('Recieved Proofs:', proofs)
    res.status(200).json({
        message: "Proofs recieved successfully",
    })
    return
}