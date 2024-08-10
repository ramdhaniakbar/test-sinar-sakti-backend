// models/Employee.ts
import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

type EmployeeAttributes = {
  id: number;
  nama: string;
  nomor: string;
  jabatan: string;
  departemen: string;
  tanggal_masuk: Date;
  foto: string;
  status: string;
}

type EmployeeCreationAttributes = Optional<EmployeeAttributes, 'id'>;

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> {
  declare id: number;
  declare nama: string;
  declare nomor: string;
  declare jabatan: string;
  declare departemen: string; 
  declare tanggal_masuk: Date;
  declare foto: string;
  declare status: string;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

export function initializeEmployee(sequelize: Sequelize) {
  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nama: DataTypes.STRING,
      nomor: DataTypes.STRING,
      jabatan: DataTypes.STRING,
      departemen: DataTypes.STRING,
      tanggal_masuk: DataTypes.DATE,
      foto: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      tableName: 'employees',
      sequelize,
    }
  );
}

export default Employee;