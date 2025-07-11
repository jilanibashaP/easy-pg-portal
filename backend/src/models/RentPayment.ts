import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Define the interface for RentPayment attributes
interface RentPaymentAttributes {
  id: string;
  pgId: string;
  tenantId: string;
  roomId: string;
  month: string;
  dueDate: Date;
  paidDate?: Date;
  rentAmount: number;
  paidAmount: number;
  lateFee: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'UPI';
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the interface for creation attributes (optional fields)
interface RentPaymentCreationAttributes extends Optional<RentPaymentAttributes, 'id' | 'paidDate' | 'lateFee' | 'paymentMethod' | 'createdAt' | 'updatedAt'> {}

// Define the RentPayment model class
class RentPayment extends Model<RentPaymentAttributes, RentPaymentCreationAttributes> implements RentPaymentAttributes {
  public id!: string;
  public pgId!: string;
  public tenantId!: string;
  public roomId!: string;
  public month!: string;
  public dueDate!: Date;
  public paidDate?: Date;
  public rentAmount!: number;
  public paidAmount!: number;
  public lateFee!: number;
  public status!: 'PAID' | 'PENDING' | 'OVERDUE';
  public paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'UPI';

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
RentPayment.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  pgId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  tenantId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  paidDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  rentAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lateFee: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('PAID', 'PENDING', 'OVERDUE'),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('CASH', 'BANK_TRANSFER', 'UPI'),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'RentPayment',
  tableName: 'rent_payments',
  timestamps: true,
});

export { RentPayment, RentPaymentAttributes, RentPaymentCreationAttributes };