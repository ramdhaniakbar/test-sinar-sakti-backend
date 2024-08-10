const pagination = (req: any, data: any) => {
   const count = data.count
   const total_page = Math.ceil(count / req.limit)

   const pagination = {
      count_data: count,
      limit: req.limit,
      total_page: total_page,
      previous_page: req.page == 1 ? null : parseInt(req.page) - 1,
      current_page: req.page,
      next_page: req.page == total_page || total_page == 0 ? null : parseInt(req.page) + 1,
   }

   return {
      pagination: pagination,
      rows: data.rows
   }
}

export default pagination