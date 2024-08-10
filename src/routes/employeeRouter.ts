import { Router } from "express"
import employeeController from "../controllers/employeeController"
import { check, query } from "express-validator"
import db from "../db/models"
import { Op } from "sequelize"

const employeeRouter = Router()

// Route Get All Karyawan
employeeRouter.get(
  "/employees",
  [
      query("limit").isInt().withMessage("Invalid limit query").notEmpty().withMessage("limit wajib diisi"),
      query('page').isInt({ min: 1 }).withMessage('Invalid page query').notEmpty().withMessage('page wajib diisi')
  ],
  employeeController.getAllEmployees
)

// Route Post Create Karyawan
employeeRouter.post(
   '/employees',
   [
      check('nama').isString().withMessage('Invalid nama').notEmpty().withMessage('Nama wajib diisi'),
      check('nomor').isInt().withMessage('Invalid nomor')
         .isLength({ min: 7, max: 8 }).withMessage('Minimal 7 angka dan maksimal 8 angka')
         .notEmpty().withMessage('Nomor wajib diisi')
         .custom(async (value) => {
            const employee = await db.Employee.findOne({ where: { nomor: value } })
            if (employee) {
               throw new Error(`Nomor sudah terdaftar oleh karyawan lain`)
            }
         }),
      check('jabatan').isString().withMessage('Invalid jabatan').notEmpty().withMessage('Jabatan wajib diisi'),
      check('departemen').isString().withMessage('Invalid departemen').notEmpty().withMessage('Departemen wajib diisi'),
      check('status').isString().withMessage('Invalid status')
         .isIn(['tetap', 'kontrak', 'probation'])
         .withMessage('Status harus tetap, kontrak atau probation')
         .notEmpty()
         .withMessage('Status wajib diisi'),
   ],
   employeeController.createEmployee
)

// Route Get Karyawan
employeeRouter.get(
   '/employee',
   [
      query("id").isInt().withMessage("Invalid id query").notEmpty().withMessage("id wajib diisi"),
   ],
   employeeController.getEmployee
)

// Route Put Update Karyawan
employeeRouter.put(
   '/employee',
   [
      check('nama').isString().withMessage('Invalid nama').notEmpty().withMessage('Nama wajib diisi'),
      check('nomor').isInt().withMessage('Invalid nomor')
         .isLength({ min: 7, max: 8 }).withMessage('Minimal 7 angka dan maksimal 8 angka')
         .notEmpty().withMessage('Nomor wajib diisi')
         .custom(async (value, { req }) => {
            const employee = await db.Employee.findOne({ 
               where: { 
                  nomor: value,
                  id: {
                     [Op.ne]: req.query.id,
                  }
               }
            })
            if (employee) {
               throw new Error(`Nomor sudah terdaftar oleh karyawan lain`)
            }
         }),
      check('jabatan').isString().withMessage('Invalid jabatan').notEmpty().withMessage('Jabatan wajib diisi'),
      check('departemen').isString().withMessage('Invalid departemen').notEmpty().withMessage('Departemen wajib diisi'),
      check('status').isString().withMessage('Invalid status')
         .isIn(['tetap', 'kontrak', 'probation'])
         .withMessage('Status harus tetap, kontrak atau probation')
         .notEmpty()
         .withMessage('Status wajib diisi'),
   ],
   employeeController.updateEmployee
)

// Route Delete Karyawan
employeeRouter.delete(
   '/employee',
   [
      query("id").isInt().withMessage("Invalid id query").notEmpty().withMessage("id wajib diisi"),
   ],
   employeeController.deleteEmployee
)

export default employeeRouter
