import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const Expense = sequelize.define('Expense', {
  pgId: { type: DataTypes.UUID, allowNull: false }, // <-- link to PG
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  category: {
    type: DataTypes.ENUM('SALARY', 'UTILITY', 'MAINTENANCE', 'CLEANING', 'INTERNET', 'OTHER'),
    allowNull: false
  },
  description: { type: DataTypes.STRING },
  paymentMethod: {
    type: DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'UPI'),
    allowNull: false
  },
  employeeId: { type: DataTypes.UUID, allowNull: true }, // optional if not a salary expense
  vendorName: { type: DataTypes.STRING, allowNull: true },
  receiptNumber: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true
});
