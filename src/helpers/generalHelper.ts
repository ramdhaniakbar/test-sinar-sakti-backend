import { writeToBuffer } from "fast-csv"
import { EmployeeType, EmployeesType } from "../types/EmployeeType"
import moment from "moment"

const exportToCSV = async (employees: EmployeesType) => {
  const buffer = await writeToBuffer(employees, {
    headers: [
      "nama",
      "nomor",
      "jabatan",
      "departemen",
      "tanggal_masuk",
      "foto",
      "status",
    ],
  })
  return buffer
}

const generateHTML = (employees: EmployeesType) => `
   <html>
   <head>
     <style>
       body {
         font-family: "Inter", sans-serif;
       }
       table {
         width: 100%;
         border-collapse: collapse;
       }
       th, td {
         font-size: 12px;
         padding: 6px 8px;
         text-align: left;
         border-bottom: 1px solid #ddd;
       }
       img {
         width: 50px;
         height: 50px;
         object-fit: cover;
       }
     </style>
   </head>
   <body>
     <h1>Data Karyawan</h1>
     <table>
       <thead>
         <tr>
           <th>Nama</th>
           <th>Nomor</th>
           <th>Jabatan</th>
           <th>Departemen</th>
           <th>Tanggal Masuk</th>
           <th>Foto</th>
           <th>Status</th>
         </tr>
       </thead>
       <tbody>
         ${employees
           .map(
             (employee: EmployeeType) => `
           <tr>
             <td>${employee.nama}</td>
             <td>${employee.nomor}</td>
             <td>${employee.jabatan}</td>
             <td>${employee.departemen}</td>
             <td>${moment(employee.tanggal_masuk).format("YYYY-MM-DD")}</td>
             <td>
               <img src="${
                 employee.foto.startsWith("https")
                   ? employee.foto
                   : `http://localhost:8000/uploads/${employee.foto}`
               }" alt="${employee.nama}" />
             </td>
             <td>${
               employee.status.charAt(0).toUpperCase() +
               employee.status.slice(1)
             }</td>
           </tr>
         `
           )
           .join("")}
       </tbody>
     </table>
   </body>
   </html>
 `

export default { exportToCSV, generateHTML }
