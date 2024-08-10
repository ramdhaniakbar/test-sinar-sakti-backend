import db from "../db/models"
import { Request, Response } from "express"
import response from "../helpers/responseHelper"
import pagination from "../helpers/paginationHelper"
import { validationResult } from "express-validator"

const getAllEmployees = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    let limit: number = 10
    let page: number = 1
    let orderBy = []

    if (typeof req.query.limit == "string") {
      const parseLimit = parseInt(req.query.limit)
      limit = parseLimit
    }

    if (typeof req.query.page == "string") {
      const parsePage = parseInt(req.query.page)
      page = parsePage
    }

    //--- sort by
    if (req.query.sort_columns && req.query.sort_directions) {
      const sortColumn = req.query.sort_columns as string
      const sortDirection = (req.query.sort_directions as string).toUpperCase()
      orderBy.push([sortColumn, sortDirection])
    } else {
      orderBy.push(["id", "DESC"])
    }

    // query table
    const employees = await db.Employee.findAndCountAll({
      order: orderBy,
      limit: limit,
      offset: limit * (page - 1),
      distinct: true,
    })

    return response.successResponse(
      res,
      200,
      "Success get all data",
      pagination(req.query, employees)
    )
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

const createEmployee = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    const employee = await db.Employee.create({
      ...req.body,
      tanggal_masuk: new Date(),
    })

    return response.successResponse(res, 200, "Success create data", employee)
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

const getEmployee = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    let id: number

    if (typeof req.query.id == "string") {
      const parseId = parseInt(req.query.id)
      id = parseId
    }

    const employee = await db.Employee.findOne({ where: { id } })

    if (!employee) {
      return response.errorResponse(res, 404, "Karyawan tidak ditemukan")
    }

    return response.successResponse(res, 200, "Success get data", employee)
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

const updateEmployee = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    let id: number

    if (typeof req.query.id == "string") {
      const parseId = parseInt(req.query.id)
      id = parseId
    }

    const employee = await db.Employee.findOne({ where: { id } })

    if (!employee) {
      return response.errorResponse(res, 404, "Karyawan tidak ditemukan")
    }

    await db.Employee.update(req.body, { where: { id } })
    await employee.reload()

    return response.successResponse(res, 200, "Success update data", employee)
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

const deleteEmployee = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    let id: number

    if (typeof req.query.id == "string") {
      const parseId = parseInt(req.query.id)
      id = parseId
    }

    const employee = await db.Employee.findOne({ where: { id } })

    if (!employee) {
      return response.errorResponse(res, 404, "Karyawan tidak ditemukan")
    }

    const deleteEmployee = await db.Employee.destroy({ where: { id } })

    return response.successResponse(
      res,
      200,
      "Success update data",
      deleteEmployee
    )
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

export default {
  getAllEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
}
