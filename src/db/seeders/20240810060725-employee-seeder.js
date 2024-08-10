"use strict"

const moment = require('moment/moment');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("employees", [
      {
        nama: "Brenda Moore",
        nomor: "50469162",
        jabatan: "Social Media Manager",
        departemen: "Marketing",
        tanggal_masuk: moment("2022-12-10", 'YYYY-MM-DD').toDate(),
        foto: "https://i.pravatar.cc/150?u=72585967-2908-4fc4-9525-3e01bac52b77",
        status: "kontrak",
        createdAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
        updatedAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
      },
      {
        nama: "Valerie Marquez",
        nomor: "92610721",
        jabatan: "UI/UX Designer",
        departemen: "Tech",
        tanggal_masuk: moment("2020-09-27", "YYYY-MM-DD").toDate(),
        foto: "https://i.pravatar.cc/150?u=a29038b1-18be-4e6f-af2f-d4322752177c",
        status: "tetap",
        createdAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
        updatedAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
      },
      {
        nama: "Melanie Carlson",
        nomor: "1906398",
        jabatan: "Complaints Handler",
        departemen: "Customer Service",
        tanggal_masuk: moment("2023-10-05", "YYYY-MM-DD").toDate(),
        foto: "https://i.pravatar.cc/150?u=739c5ad7-f4df-49d2-bcfe-8266b9f8de4d",
        status: "kontrak",
        createdAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
        updatedAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
      },
      {
        nama: "Kelly Schmidt",
        nomor: "54811476",
        jabatan: "Backend Developer",
        departemen: "Tech",
        tanggal_masuk: moment("2023-06-07", "YYYY-MM-DD").toDate(),
        foto: "https://i.pravatar.cc/150?u=1fe61c9a-8810-4071-8571-0146857c685a",
        status: "kontrak",
        createdAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
        updatedAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
      },
      {
        nama: "Deborah Frazier",
        nomor: "30368469",
        jabatan: "QA Engineer",
        departemen: "Tech",
        tanggal_masuk: moment("2024-04-04", "YYYY-MM-DD").toDate(),
        foto: "https://i.pravatar.cc/150?u=f71d3cbc-e9e3-491a-895b-184fa36f287e",
        status: "tetap",
        createdAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
        updatedAt: moment(new Date(), 'YYYY-MM-DD').toDate(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', {}, {});
  },
}
