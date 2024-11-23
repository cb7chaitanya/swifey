import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import prisma from "../db"
import { JWT_SECRET } from "../conf"

export const profileCreation = async(req: Request, res: Response) => {
    try {
        const { name, DOB, gender, college, currentlyWorking, password, walletAddress } = req.body;
        // const { success } = profileCreationSchema.safeParse(req.body)
        // if(!success){
        //     res.status(400).json({
        //       message: "Missing Req uired Fields"  
        //     })
        //     return
        // }
        const userExists = await prisma.user.findUnique({
            where: {
                walletAddress: walletAddress
            }
        })
        if(userExists){
            res.status(400).json({
                message: "User already exists"
            })
            return
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name: name,
                dateOfBirth: DOB,
                gender: gender,
                graduatedFrom: college,
                currentlyWorking: currentlyWorking.currentEmployment,
                role: currentlyWorking.role,
                walletAddress: walletAddress,
                password: hashedPassword
            }
        })
        const userId = user.id
        const token = jwt.sign({
            userId
        }, JWT_SECRET || 'secret' )
        res.json({
            message: "Profile successfully created",
            token: token
        })
        return 
    } catch(error){
        console.error('Error generating profile', error)
        res.status(500).json({
            message: "Error creating profile"
        })
        return
    }
} 

export const signin = async(req:Request, res:Response) => {
    try {   
        const { password, walletAddress } = req.body
        // const { success } = signinSchema.safeParse(req.body)
        // if(!success){
        //     res.status(400).json({
        //         message: "Missing required files"
        //     })
        // }
        const user = await prisma.user.findUnique({
            where: {
                walletAddress: walletAddress
            }
        })
        if(!user){
            res.json({
                message: "User not found"
            })
            return
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            res.status(400).json({
                message: "Invalid password"
            })
            return
        }
        const userId = user.id
        const token = jwt.sign({
            userId
        }, JWT_SECRET || 'secret')
        res.status(200).json({
            message: "Successfully signed in",
            token: token
        })
        return
    } catch(error){
        console.error('Error signing in', error)
        res.status(500).json({
            message: 'Error signing in'
        })
        return
    }
}

export const reclaimVerification = async(req: Request, res: Response) => {
    try{    
        const { verificationStatus, verificationDetails } = req.body
        const userId = req.userId
        // const { success } = reclaimVerificationSchema.safeParse(req.body)
        // if(!success){
        //     res.json({
        //         message: "Missing required fields"
        //     })
        //     return
        // } 
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                verificationStatus: verificationStatus,
                verificationDetails: verificationDetails
            }
        })
        res.status(200).json({
            message: "User Verification complete"
        })
        return
    } catch(error){
        console.error("Error verifying through reclaim", error)
        res.json({
            message: "Verification via reclaim failed"
        })
        return
    }
}
