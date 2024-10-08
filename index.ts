const express = require('express')
import dotenv from "dotenv"
import cors from "cors"
import fileUpload from 'express-fileupload'
import cookieParser from "cookie-parser"
import { Application, Request, Response } from "express"
import path from "path"
// Routes
import employeeRouter from "./src/routes/employeeRouter"
import dashboardRouter from './src/routes/dashboardRouter'

dotenv.config()

const app: Application = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload())

// PORT
const port = process.env.PORT || 8000

// Server
try {
   app.listen(port, () => {
      console.log(`server is running on port ${port}`);
   })
} catch (error) {
   console.log(`Error occured: ${error.message}`);
}

app.get('/', (req: Request, res: Response) => {
   res.json({
      message: 'sinar sakti backend api'
   })
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/v1', employeeRouter)
app.use('/api/v1', dashboardRouter)

export default app