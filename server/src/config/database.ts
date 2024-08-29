import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.DB_URL!, {
  dialect: 'postgres',
  
  logging: false,  // Set to true if you want to see SQL queries logged in the console
});

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

