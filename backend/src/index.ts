import express, { Request, Response } from "express"
import { mainRouter } from "./routes"
const app = express()
app.use(express.json())

app.get('/', async(req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/v1', mainRouter)

app.listen(3000,() => {
    console.log('Server listening on port 3000')
})