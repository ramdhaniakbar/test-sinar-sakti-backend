import { UploadedFile } from "express-fileupload"

const validateFileUpload = (
   file: UploadedFile,
   filename: string,
   allowExtension: string[],
   maxFileSize: number = 5
) => {
   //--- Validate format
   if (!allowExtension.includes(file.mimetype)) {
      return `Format ${filename} tidak didukung`
   }

   //--- Validate size
   if (file.size / (1024 * 1024) > maxFileSize) {
      return `Ukuran ${filename} terlalu besar`
   }
}

export default validateFileUpload