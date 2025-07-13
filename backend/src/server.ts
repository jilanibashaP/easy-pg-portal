import app from './app';
import { sequelize } from './config/db';

const PORT = 5000;
// require('dotenv').config()
// import dotenv from "dotenv";
// dotenv.config();


import './schedule_payments/creating_payments'; // This will trigger the auto-start

const startServer = async () => {
    // console.log('Starting server...', process.env);
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // Sync the models and alter tables to match the model definitions
        await sequelize.sync({ alter: false  });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        throw error; // Ensure the error is thrown to stop server start
    }
};

const initialize = async () => {
    try {
        await connectToDatabase();
        await startServer();
        console.log('Server and database connection process initiated.');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
};

initialize();