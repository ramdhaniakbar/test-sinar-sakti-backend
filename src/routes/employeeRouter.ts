import { Router } from "express";
import employeeController from "../controllers/employeeController";

const employeeRouter = Router()

employeeRouter.get('/employees', employeeController.getAllEmployees)

export default employeeRouter