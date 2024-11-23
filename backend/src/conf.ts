import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET
export const APP_ID = process.env.APP_ID
export const APP_SECRET = process.env.APP_SECRET
export const PROVIDER_ID = process.env.PROVIDER_ID