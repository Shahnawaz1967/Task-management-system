import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './User';

class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public status!: string;
  public dueDate!: Date;
  public userId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
      defaultValue: 'Pending',
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'tasks',
  }
);

Task.belongsTo(User, { foreignKey: 'userId' });

export default Task;
