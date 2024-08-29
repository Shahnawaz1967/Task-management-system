import { Request, Response } from 'express';
import prisma from '../lib/db';




// Create a new task
export const createTask = async (req: Request, res: Response) => {
    const { title, description, status, dueDate } = req.body;
    const userId = parseInt(req.user!.id, 10);  // Convert userId to integer
  
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status,
          dueDate: dueDate ? new Date(dueDate) : null,
          userId,  // Ensure this is an integer
        },
      });
      res.status(201).json(task);
    } catch (error) {
      console.error('Detailed error:', error);  // Log detailed error
      res.status(500).json({ message: 'Error creating task', error });
    }
  };

// Get all tasks for the logged-in user
export const getTasks = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;
  const userId = req.user!.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id), userId },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        status,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id), userId },
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};
