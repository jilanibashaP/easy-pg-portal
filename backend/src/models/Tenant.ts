import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db';

export const Tenant = sequelize.define('Tenant', {
  pgId: { type: DataTypes.UUID, allowNull: false }, // <-- link to PG
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: { type: DataTypes.STRING, allowNull: false },
  contactNumber: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  roomId: { type: DataTypes.UUID, allowNull: false }, // Foreign key to Room
  roomName: { type: DataTypes.STRING, allowNull: true }, // Name of the room
  bedNumber: { type: DataTypes.INTEGER, allowNull: false },
  joiningDate: { type: DataTypes.DATEONLY, allowNull: false },
  rentDueDate: { type: DataTypes.INTEGER, allowNull: false }, // e.g., 1st, 15th
  securityDeposit: { type: DataTypes.INTEGER },
  monthlyRent: { type: DataTypes.INTEGER },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'LEFT'),
    allowNull: false,
    defaultValue: 'ACTIVE'
  },
  emergencyContactName: { type: DataTypes.STRING },
  emergencyContactNumber: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  aadharNumber: { type: DataTypes.STRING },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  timestamps: true
});
