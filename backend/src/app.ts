
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes';
import tenantRoutes from './routes/tenantRoutes';
import employeeRoutes from './routes/employeeRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';


const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('Initializing routes...');
app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/rent-payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);


export default app;