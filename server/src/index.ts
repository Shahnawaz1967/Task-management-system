import dotenv from 'dotenv';
import app from './app';
import { connectToDatabase } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
