// models/Owner.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

export interface OwnerAttributes {
  id: string;
  pgId: string; // Auto-generated unique PG ID
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string; // Password should be hashed
  alternatePhoneNumber?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  profileImage?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  
  // Professional/Business Details
  businessName?: string;
  businessRegistrationNumber?: string;
  panNumber?: string;
  aadharNumber?: string;
  gstNumber?: string;
  
  // Bank Details
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelation?: string;
  
  // System Fields
  isVerified?: boolean;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  lastLogin?: Date;
  isActive?: boolean;
  
  // Additional Fields
  totalPGs?: number;
  totalRooms?: number;
  totalTenants?: number;
  joinedDate?: Date;
  subscriptionPlan?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  subscriptionExpiry?: Date;
  
  // Preferences
  preferredLanguage?: string;
  timezone?: string;
  notificationPreferences?: object;
}

type OwnerCreationAttributes = Optional<OwnerAttributes, 'id' | 'pgId'>;

export class Owner extends Model<OwnerAttributes, OwnerCreationAttributes> implements OwnerAttributes {
  public id!: string;
  public pgId!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public phoneNumber!: string;
  public password!: string; // Password should be hashed
  public alternatePhoneNumber?: string;
  public dateOfBirth?: Date;
  public gender?: 'MALE' | 'FEMALE' | 'OTHER';
  public profileImage?: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public pincode!: string;
  public country?: string;
  
  // Professional/Business Details
  public businessName?: string;
  public businessRegistrationNumber?: string;
  public panNumber?: string;
  public aadharNumber?: string;
  public gstNumber?: string;
  
  // Bank Details
  public bankName?: string;
  public accountNumber?: string;
  public ifscCode?: string;
  public accountHolderName?: string;
  
  // Emergency Contact
  public emergencyContactName?: string;
  public emergencyContactNumber?: string;
  public emergencyContactRelation?: string;
  
  // System Fields
  public isVerified?: boolean;
  public verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  public lastLogin?: Date;
  public isActive?: boolean;
  
  // Additional Fields
  public totalPGs?: number;
  public totalRooms?: number;
  public totalTenants?: number;
  public joinedDate?: Date;
  public subscriptionPlan?: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  public subscriptionExpiry?: Date;
  
  // Preferences
  public preferredLanguage?: string;
  public timezone?: string;
  public notificationPreferences?: object;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Owner.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  pgId: {
    type: DataTypes.UUID,
    unique: true,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50],
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [10, 15],
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100], // Minimum length for security
    },
  },
  alternatePhoneNumber: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15],
    },
  },
  dateOfBirth: DataTypes.DATE,
  gender: {
    type: DataTypes.ENUM('MALE', 'FEMALE', 'OTHER'),
  },
  profileImage: DataTypes.STRING,
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pincode: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 6],
    },
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India',
  },
  
  // Professional/Business Details
  businessName: DataTypes.STRING,
  businessRegistrationNumber: DataTypes.STRING,
  panNumber: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 10],
    },
  },
  aadharNumber: {
    type: DataTypes.STRING,
    validate: {
      len: [12, 12],
    },
  },
  gstNumber: {
    type: DataTypes.STRING,
    validate: {
      len: [15, 15],
    },
  },
  
  // Bank Details
  bankName: DataTypes.STRING,
  accountNumber: DataTypes.STRING,
  ifscCode: {
    type: DataTypes.STRING,
    validate: {
      len: [11, 11],
    },
  },
  accountHolderName: DataTypes.STRING,
  
  // Emergency Contact
  emergencyContactName: DataTypes.STRING,
  emergencyContactNumber: {
    type: DataTypes.STRING,
    validate: {
      len: [10, 15],
    },
  },
  emergencyContactRelation: DataTypes.STRING,
  
  // System Fields
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  verificationStatus: {
    type: DataTypes.ENUM('PENDING', 'VERIFIED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  lastLogin: DataTypes.DATE,
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  
  // Additional Fields
  totalPGs: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalRooms: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalTenants: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  joinedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('BASIC', 'PREMIUM', 'ENTERPRISE'),
    defaultValue: 'BASIC',
  },
  subscriptionExpiry: DataTypes.DATE,
  
  // Preferences
  preferredLanguage: {
    type: DataTypes.STRING,
    defaultValue: 'en',
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'Asia/Kolkata',
  },
  notificationPreferences: {
    type: DataTypes.JSON,
    defaultValue: {
      email: true,
      sms: true,
      push: true,
      marketing: false,
    },
  },
}, {
  sequelize,
  modelName: 'Owner',
  tableName: 'Owners',
  timestamps: true,
});