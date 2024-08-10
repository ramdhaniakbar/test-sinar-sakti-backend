import { Response } from "express"

const errorValidate = (res: Response, status: number, error: any) => {
   const response = {
      status: status,
      message: error[0]['msg'],
      data: [],
      error: error
   }

   return res.status(status).send(response)
}

const successResponse = (res: Response, status: number, message: string, data: [] | {}) => {
   const response = {
      status: status,
      message: message,
      data: data,
      error: []
   }

   return res.status(status).send(response)
}

const errorResponse = (res: Response, status: number, message: string) => {
   const response = {
      status: status,
      message: message || 'failed',
      data: [],
      error: []
   }

   res.status(status).send(response)
}

export default { errorValidate, successResponse, errorResponse }