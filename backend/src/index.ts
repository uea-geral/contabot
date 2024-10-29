import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import {router} from './routes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: '*',
    }),
)
app.use(express.json())
app.use(router)

app.listen(PORT)
