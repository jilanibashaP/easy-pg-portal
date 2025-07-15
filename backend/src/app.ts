import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes';
import tenantRoutes from './routes/tenantRoutes';
import employeeRoutes from './routes/employeeRoutes';
import paymentRoutes from './routes/paymentRoutes';
import expenseRoutes from './routes/expenseRoutes';
import ownerRoutes from './routes/ownerRoutes';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { login, signup } from './controllers/authController';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('Initializing routes...');

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1]; // 'Bearer <token>'
  console.log("from authenticateToken", token);
  if (!token) {
    res.status(401).json({ message: 'Access Denied. No token provided.' });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};
// Apply the middleware to protect all routes
app.use('/api', authenticateToken); // This will apply to all routes below

app.use('/api/rooms', roomRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/rent-payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api/owners", ownerRoutes);

// Owner authentication (mobile/password)
app.post('/login', login);
app.post('/signup', signup);

export default app;