import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const Employee = sequelize.define('Employee', {
  pgId: { type: DataTypes.UUID, allowNull: false }, // <-- link to PG
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  contactNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM('CLEANING_STAFF', 'SECURITY', 'COOK', 'MANAGER', 'OTHER'),
    allowNull: false
  },
  salary: { type: DataTypes.INTEGER },
  joiningDate: { type: DataTypes.DATEONLY },
  address: { type: DataTypes.STRING },
  emergencyContactName: { type: DataTypes.STRING },
  emergencyContactNumber: { type: DataTypes.STRING },
  aadharNumber: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true
});
