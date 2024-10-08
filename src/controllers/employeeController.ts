import db from "../db/models"
import { Request, Response } from "express"
import response from "../helpers/responseHelper"
import pagination from "../helpers/paginationHelper"
import { validationResult } from "express-validator"
import { UploadedFile } from "express-fileupload"
import path from "path"
import fs from "fs"
import moment from "moment"
import { Op } from "sequelize"
import { parse } from "fast-csv"
import { EmployeeType } from "../types/EmployeeType"
import generalHelper from "../helpers/generalHelper"
import * as htmlPdf from 'html-pdf';

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
    let whereQuery: any = {}

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

    //--- filter by departemen
    if (req.query.departemen) {
      whereQuery.departemen = {
        [Op.in]: (req.query.departemen as string).split(","),
      }
    }

    //--- filter by status
    if (req.query.status) {
      whereQuery.status = {
        [Op.in]: (req.query.status as string).split(","),
      }
    }

    // query table
    const employees = await db.Employee.findAndCountAll({
      order: orderBy,
      limit: limit,
      offset: limit * (page - 1),
      where: whereQuery,
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

  const t = await db.sequelize.transaction()
  try {
    const employee = await db.Employee.create(
      {
        ...req.body,
        tanggal_masuk: new Date(),
      },
      { transaction: t }
    )

    let fileUrl: string = null
    if (req.files) {
      const file = req.files.foto as UploadedFile
      const filename =
        moment().format("YYYY-MM-DD-HHmmss") +
        Math.floor(10000 + Math.random() * 90000) +
        "." +
        file.name.split(".").pop()

      const uploadPath = path.join(__dirname + "/../../uploads", filename)

      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true })
      }

      file.mv(uploadPath, async (error) => {
        if (error) {
          await t.rollback()
          return response.errorResponse(res, 400, error.message)
        }
      })

      fileUrl = "uploads" + uploadPath.split("/uploads").pop()
    }

    employee.foto = fileUrl
    await employee.save({ transaction: t })
    await t.commit()

    return response.successResponse(res, 200, "Success create data", employee)
  } catch (error) {
    await t.rollback()
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
  const t = await db.sequelize.transaction()
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

    await db.Employee.update(req.body, { where: { id }, transaction: t })

    let fileUrl: string = null
    if (req.files) {
      const file = req.files.foto as UploadedFile
      const filename =
        moment().format("YYYY-MM-DD-HHmmss") +
        Math.floor(10000 + Math.random() * 90000) +
        "." +
        file.name.split(".").pop()

      const uploadPath = path.join(__dirname + "/../../uploads", filename)

      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true })
      }

      file.mv(uploadPath, async (error) => {
        if (error) {
          await t.rollback()
          return response.errorResponse(res, 400, error.message)
        }
      })

      if (employee.foto && !employee.foto.startsWith("https")) {
        fs.unlink(__dirname + "/../../" + employee.foto, async (error) => {
          if (error) {
            await t.rollback()
            return response.errorResponse(res, 400, error.message)
          }
        })
      }

      fileUrl = "uploads" + uploadPath.split("/uploads").pop()

      employee.foto = fileUrl
      await employee.save({ transaction: t })
    }

    await employee.reload({ transaction: t })
    await t.commit()

    return response.successResponse(res, 200, "Success update data", employee)
  } catch (error) {
    await t.rollback()
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

const importFileCSV = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }

  let fileCSV: UploadedFile

  if (req.files.file) {
    fileCSV = req.files.file as UploadedFile
  }

  const results = []
  let errors: string[] = []
  const columns = [
    "nama",
    "nomor",
    "jabatan",
    "departemen",
    "tanggal_masuk",
    "foto",
    "status",
  ]

  const stream = parse<EmployeeType, EmployeeType>({
    headers: [
      "nama",
      "nomor",
      "jabatan",
      "departemen",
      "tanggal_masuk",
      "foto",
      "status",
    ],
    renameHeaders: true,
  })
    .validate((row) => {
      const rowKeys = Object.keys(row)
      console.log("row keys ", rowKeys)
      const isValid = rowKeys.every((key) => columns.includes(key))

      if (!isValid) {
        stream.emit("error", new Error("Periksa kembali column csv anda"))
        return false
      }
      return true
    })
    .on("error", (error: any) => {
      console.log(error)
      errors.push(error.message)
    })
    .on("data", async (row) => {
      console.log("row ", row)
      results.push(row)
    })
    .on("end", async (rowCount: number) => {
      if (errors.length > 0) {
        console.log(errors)
        response.errorResponse(res, 400, errors[0])
        return
      }

      const insertEmployee = await db.Employee.bulkCreate(results)
      if (insertEmployee.length > 0) {
        response.successResponse(res, 200, "Success import csv", insertEmployee)
        return
      } else {
        response.errorResponse(res, 500, "Gagal import csv")
        return
      }
    })

  stream.write(fileCSV.data.toString())
  stream.end()
}

const exportFileEmployee = async (req: Request, res: Response) => {
  //---- Validation
  const validate = validationResult(req)
  if (!validate.isEmpty()) {
    return response.errorValidate(res, 400, validate.array())
  }
  try {
    const employees = await db.Employee.findAll({
      attributes: [
        "nama",
        "nomor",
        "jabatan",
        "departemen",
        "tanggal_masuk",
        "foto",
        "status",
      ],
    })

    if (req.query.type == 'pdf') {
      const htmlContent = generalHelper.generateHTML(employees);
      const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
        htmlPdf.create(htmlContent).toBuffer((err, buffer) => {
          if (err) reject(err);
          resolve(buffer);
        });
      });
  
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="employees.pdf"',
        'Content-Length': pdfBuffer.length,
      })

      return res.status(200).send(pdfBuffer)
    } else {
      const csvBuffer = await generalHelper.exportToCSV(employees)
  
      res.set({
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="employees.csv"',
        "Content-Length": csvBuffer.length,
      })

      return res.status(200).send(csvBuffer)
    }
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
  importFileCSV,
  exportFileEmployee,
}
