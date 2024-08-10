// models/index.ts
import { Sequelize } from 'sequelize';
import Employee, { initializeEmployee } from './employee';

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

const db: {
  sequelize: typeof sequelize;
  Sequelize: typeof Sequelize;
  Employee: typeof Employee;
} = {
  sequelize,
  Sequelize,
  Employee
};

initializeEmployee(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Employee = Employee;

export default db;