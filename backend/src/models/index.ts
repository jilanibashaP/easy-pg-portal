import { Tenant } from './Tenant';
import { Room } from './Room';
import { RentPayment } from './RentPayment';
import { Expense } from './Expense';
import { Employee } from './Employee';
// Importing models and defining associations
Tenant.belongsTo(Room, { foreignKey: 'roomId' });
Room.hasMany(Tenant, { foreignKey: 'roomId' });

RentPayment.belongsTo(Tenant, { foreignKey: 'tenantId' });
RentPayment.belongsTo(Room, { foreignKey: 'roomId' });

Expense.belongsTo(Employee, { foreignKey: 'employeeId' });
