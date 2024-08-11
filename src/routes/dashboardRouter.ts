import { Router } from "express"
import dashboardController from "../controllers/dashboardController"

const dashboardRouter = Router()

// Route Get Dashboard
dashboardRouter.get(
   '/dashboard',
   dashboardController.dashboard
)

export default dashboardRouter