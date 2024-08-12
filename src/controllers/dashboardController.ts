import { Request, Response } from "express"
import response from "../helpers/responseHelper"
import db from "../db/models";

const dashboard = async (req: Request, res: Response) => {
   try {
      const dataEmployees = await db.Employee.findAll({
         attributes: [
           [db.sequelize.literal(`COUNT(CASE WHEN status = 'kontrak' THEN 1 END)`), 'kontrak_count'],
           [db.sequelize.literal(`COUNT(CASE WHEN status = 'probation' THEN 1 END)`), 'probation_count'],
           [db.sequelize.literal('COUNT(*)'), 'total_count']
         ],
      });

      const departemens = await db.Employee.findAll({
         attributes: [
            [db.sequelize.fn('DISTINCT', db.sequelize.col('departemen')), 'departemen']
         ],
         raw: true
      })

      return response.successResponse(
         res, 
         200, 
         'Success get dashboard', 
         {
            data_employees: dataEmployees[0],
            departemens: departemens.map((row) => row.departemen)
         }
      )
   } catch (error) {
      console.log(error);
      return response.errorResponse(res, 500, 'Internal server error')
   }
}

export default { dashboard }