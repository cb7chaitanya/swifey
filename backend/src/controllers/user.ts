import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { Request, Response } from "express"
import prisma from "../db"
import { JWT_SECRET } from "../conf"
import { profileCreationSchema, reclaimVerificationSchema, signInSchema } from '@cb7chaitanya/swifey-common/src'
import { StakingTransactionStatus, StakingStatus } from "@prisma/client"

export const getUserById = async(req: Request, res: Response) => {
    try {
        const userId = req.userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                dateOfBirth: true,
                gender: true,
                graduatedFrom: true,
                currentlyWorking: true,
                walletAddress: true,
                role: true,
                verificationStatus: true
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
        return
    } catch(error) {
        console.error("Error fetching user by ID", error);
        res.status(500).json({
            message: "Error fetching user"
        });
        return
    }
}

export const profileCreation = async(req: Request, res: Response) => {
    try {
        const { name, DOB, gender, college, currentlyWorking, password, walletAddress } = req.body;
        console.log(req.body)
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
        res.status(200).json({
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
        // const { success } = signInSchema.safeParse(req.body)
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

export const unmatchedProfiles = async(req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                connections: {
                    include: {
                        participants: true
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        const connectedUserIds = user.connections.flatMap(connection => 
            connection.participants.map(participant => participant.id)
        );

        const unmatchedProfiles = await prisma.user.findMany({
            where: {
                id: {
                    notIn: [userId!, ...connectedUserIds]
                }
            },
            select: {
                id: true,
                name: true,
                dateOfBirth: true,
                gender: true,
                graduatedFrom: true,
                currentlyWorking: true,
                walletAddress: true,
                role: true,
                connections: {
                    include: {
                        participants: true
                    }
                }
            }
        });

        res.status(200).json(unmatchedProfiles);
        return
    } catch (error) {
        console.error("Error getting unmatched profiles", error);
        res.status(500).json({
            message: "Error getting unmatched profiles"
        });
        return
    }
}

export const initiateConnection = async(req: Request, res: Response) => {
    try {       
        const userId = req.userId!;
        const { transactionHash, otherUserId } = req.body
        const connection = await prisma.connection.create({
            data: {
                participants: {
                    connect: [
                        { id: userId }, 
                        { id: otherUserId }
                    ]
                },
                stakingStatus: StakingStatus.PENDING,
            }
        });

        const stakingTransaction = await prisma.stakingTransaction.create({
            data: {
                userId: userId,
                amount: 0.2, 
                transactionHash: transactionHash, // Transaction hash not obtainable as transaction is not being signed from the frontend
                status: StakingTransactionStatus.CONFIRMED
            }
        });

        res.status(200).json({
            message: "Staking transaction created successfully",
            stakingTransaction,
            connection
        });
        return
    } catch(error) {
        console.error('Error during staking', error);
        res.status(500).json({
            message: "Error during staking"
        });
        return
    }
}

export const fetchReceivedConnections = async(req: Request, res: Response) => {
    try {
        const userId = req.userId; 
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                connections: {
                    where: {
                        stakingStatus: StakingStatus.PENDING, 
                    },
                    include: {
                        participants: true 
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const pendingReceivedConnections = user.connections.filter(connection => 
            connection.participants.length > 1 && connection.participants[1].id === userId 
        );

        res.status(200).json({
            pendingReceivedConnections: pendingReceivedConnections
        });
        return;
    } catch (error) {
        console.error("Error fetching pending received connections", error);
        res.status(500).json({
            message: "Error fetching pending received connections"
        });
        return;
    }
}

export const fetchPendingOutgoingConnections = async(req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                connections: {
                    where: {
                        stakingStatus: StakingStatus.PENDING, 
                    },
                    include: {
                        participants: true 
                    }
                }
            }
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const pendingOutgoingConnections = user.connections.filter(connection => 
            connection.participants.length > 1 && connection.participants[0].id === userId 
        );

        res.status(200).json({
            pendingOutgoingConnections: pendingOutgoingConnections
        });
        return;
    } catch (error) {
        console.error("Error fetching pending outgoing connections", error);
        res.status(500).json({
            message: "Error fetching pending outgoing connections"
        });
        return;
    }
}

export const acceptConnection = async(req: Request, res: Response) => {
    try {
        const userId = req.userId!;
        const { otherUserId } = req.body;

        const connection = await prisma.connection.findFirst({
            where: {
                participants: {
                    every: {
                        id: { in: [otherUserId, userId] }
                    }
                },
                stakingStatus: StakingStatus.PENDING
            }
        });

        if (!connection) {
            res.status(404).json({ message: "Connection not found" });
            return;
        }

        await prisma.connection.update({
            where: { id: connection.id },
            data: { stakingStatus: StakingStatus.ACTIVE }
        });

        await prisma.stakingTransaction.create({
            data: {
                userId: userId,
                amount: 0.2,
                transactionHash: "transaction_hash_placeholder",
                status: StakingTransactionStatus.CONFIRMED
            }
        });

        res.status(200).json({
            message: "Connection accepted successfully"
        });
        return
    } catch (error) {
        console.error('Error accepting connection', error);
        res.status(500).json({
            message: "Error accepting connection"
        });
        return
    }
}

export const declineConnection = async(req: Request, res: Response) => {
    try {
        const userId = req.userId!;
        const { otherUserId } = req.body;

        const connection = await prisma.connection.findFirst({
            where: {
                participants: {
                    every: {
                        id: { in: [otherUserId, userId] }
                    }
                }
            }
        });

        if (!connection) {
            res.status(404).json({ message: "Connection not found" });
            return;
        }

        await prisma.connection.delete({
            where: { id: connection.id }
        });

        res.status(200).json({
            message: "Connection declined successfully"
        });
        return
    } catch (error) {
        console.error('Error declining connection', error);
        res.status(500).json({
            message: "Error declining connection"
        });
        return
    }
}

