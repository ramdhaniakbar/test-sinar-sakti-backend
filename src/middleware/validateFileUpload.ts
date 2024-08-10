import { UploadedFile } from "express-fileupload"

const validateImageUpload = (
   file: UploadedFile,
   filename: string = 'image',
   allowExtension: string[] = ["image/png", "image/jpeg", "image/jpg"],
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

export default {
   validateImageUpload
}