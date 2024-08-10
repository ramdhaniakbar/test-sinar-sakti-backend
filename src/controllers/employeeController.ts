import db from "../db/models"
import { Request, Response } from "express"
import response from "../helpers/responseHelper"
import pagination from "../helpers/paginationHelper"

const getAllEmployees = async (req: Request, res: Response) => {
  try {
    let limit: number
    let orderBy = []

    if (typeof req.query.limit == 'string') {
      const parseLimit = parseInt(req.query.limit as string)
      limit = parseLimit
    }

    //--- sort by
    if (req.query.sort_columns && req.query.sort_directions) {
      const sortColumn = req.query.sort_columns as string
      const sortDirection = (req.query.sort_directions as string).toUpperCase()
      orderBy.push([sortColumn, sortDirection])
    } else {
      orderBy.push(["id", "DESC"])
    }

    const employees = await db.Employee.findAndCountAll({
      limit: limit,
      distinct: true
    })

    return response.successResponse(res, 200, "Success get all data", pagination(req.query, employees))
  } catch (error) {
    console.log(error)
    return response.errorResponse(res, 500, "Internal server error")
  }
}

export default { getAllEmployees }
