import express from 'express';
import authRoutes from './routes/auth';
import taskRoutes from './routes/task';
import authenticate from './middleware/authenticate';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', authenticate, taskRoutes);

export default app;
