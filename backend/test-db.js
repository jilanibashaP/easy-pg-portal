import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('pg_db', 'postgres', 'Jilani@23', {
  host: '18.60.156.218',
  dialect: 'postgres',
  port: 5432,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
  }
})();
