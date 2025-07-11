// models/Room.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface RoomAttributes {
  id: string;
  pgId: string;
  name: string;
  type: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD';
  floor?: number;
  totalBeds?: number;
  occupiedBeds?: number;
  monthlyRent?: number;
  isActive?: boolean;
}

type RoomCreationAttributes = Optional<RoomAttributes, 'id'>;

export class Room extends Model<RoomAttributes, RoomCreationAttributes> implements RoomAttributes {
  public id!: string;
  public pgId!: string;
  public name!: string;
  public type!: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'QUAD';
  public floor?: number;
  public totalBeds?: number;
  public occupiedBeds?: number;
  public monthlyRent?: number;
  public isActive?: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Room.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  pgId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('SINGLE', 'DOUBLE', 'TRIPLE', 'QUAD'),
    allowNull: false,
  },
  floor: DataTypes.INTEGER,
  totalBeds: DataTypes.INTEGER,
  occupiedBeds: DataTypes.INTEGER,
  monthlyRent: DataTypes.INTEGER,
  isActive: DataTypes.BOOLEAN,
}, {
  sequelize,
  modelName: 'Room',
  tableName: 'Rooms',
  timestamps: true,
});
