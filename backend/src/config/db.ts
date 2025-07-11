// export const development = {
//     username: "your_db_username",
//     password: "your_db_password",
//     database: "your_db_name",
//     host: "127.0.0.1",
//     dialect: "postgres"
// };

// export const production = {
//     username: process.env.DB_USERNAME,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     dialect: "postgres"
// };

//postgres
//Jilani@23

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// export const sequelize = new Sequelize(
//     process.env.DB_NAME!,
//     process.env.DB_USER!,
//     process.env.DB_PASSWORD!,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//         port: Number(process.env.DB_PORT),
//         dialectOptions: {
//             ssl: {
//                 rejectUnauthorized: false, // Disables SSL certificate validation
//             },
//         },
//         logging: false // Disable SQL query logging in the console
//     }
// );

export const sequelize = new Sequelize('pg_db_1', 'postgres', 'Jilani@23', {
    host: 'localhost',
    dialect: 'postgres',
    // logging: console.log, // <-- enable this
    logging: false, // Disable SQL query logging in the console
});

