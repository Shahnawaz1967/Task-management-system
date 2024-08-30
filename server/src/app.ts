import express from 'express';
import cors from 'cors'
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';

const app = express();
app.use(cors({
    origin:process.env.ALLOWED_ORIGIN, credentials:true
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

export default app;
