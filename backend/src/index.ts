import express, { Request, Response } from "express"
import { mainRouter } from "./routes"
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', async(req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/v1', mainRouter)

app.listen(3000,() => {
    console.log('Server listening on port 3000')
})