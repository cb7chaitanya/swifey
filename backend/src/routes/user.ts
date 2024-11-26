import { Router } from "express";
import { acceptConnection, declineConnection, fetchPendingOutgoingConnections, fetchReceivedConnections, getUserById, initiateConnection, profileCreation, reclaimVerification, signin, unmatchedProfiles } from "../controllers/user";
import { authMiddleware } from "../authMiddleware";

export const userRouter = Router()

userRouter.post('/profile-creation', profileCreation)
userRouter.post('/signin', signin)
userRouter.get('/your-profile', authMiddleware, getUserById)
userRouter.put('/reclaim-verification', authMiddleware, reclaimVerification)
userRouter.post('/initiate-connection', authMiddleware, initiateConnection)
userRouter.get('/unmatched-profiles', authMiddleware, unmatchedProfiles)
userRouter.get('/pending-recieved-connections', authMiddleware, fetchReceivedConnections)
userRouter.get('/pending-outgoing-connections', authMiddleware, fetchPendingOutgoingConnections)
userRouter.put('/accept-connection', authMiddleware, acceptConnection)
userRouter.delete('/decline-connection', authMiddleware, declineConnection)