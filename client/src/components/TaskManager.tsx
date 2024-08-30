import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react";
import { SERVER_URL } from "@/lib/constants";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

// API Endpoints
const API_URL = `${SERVER_URL}/tasks`;

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  // Function to get the token from local storage
  const getToken = () => {
    return localStorage.getItem("token"); // Change "token" to the key used to store your JWT
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    const token = getToken();
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token here
        },
        credentials: "include",
      });
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const token = getToken();
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // Attach token here
          },
          credentials: "include",
          body: JSON.stringify({
            title: newTask.trim(),
            description: "",
            dueDate: null,
          }),
        });

        if (response.ok) {
          const newTaskFromApi = await response.json();
          setTasks([...tasks, { id: newTaskFromApi.id, title: newTask.trim(), completed: false }]);
          setNewTask("");
        } else {
          console.error("Failed to add task:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  // Toggle task completion
  const toggleTask = async (id: number) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token here
        },
        credentials: "include",
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });

      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
      } else {
        console.error("Failed to toggle task:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token here
        },
        credentials: "include",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== id));
      } else {
        console.error("Failed to delete task:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // Start editing a task
  const startEditingTask = (id: number, text: string) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  // Save edited task
  const saveEditedTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTaskId !== null && editingTaskText.trim()) {
      const token = getToken();
      try {
        const response = await fetch(`${API_URL}/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ title: editingTaskText.trim(), completed: false }),
        });

        if (response.ok) {
          const updatedTasks = tasks.map((task) =>
            task.id === editingTaskId ? { ...task, title: editingTaskText.trim() } : task
          );
          setTasks(updatedTasks);
          setEditingTaskId(null);
          setEditingTaskText("");
        } else {
          console.error("Failed to save task:", response.statusText);
        }
      } catch (error) {
        console.error("Failed to save task:", error);
      }
    }
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      <form onSubmit={addTask} className="flex mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow mr-2"
        />
        <Button type="submit">
          <PlusIcon className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Button>
      </div>

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
            <div className="flex items-center">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mr-2"
              />
              {editingTaskId === task.id ? (
                <Input
                  value={editingTaskText}
                  onChange={(e) => setEditingTaskText(e.target.value)}
                  className="flex-grow"
                />
              ) : (
                <label
                  htmlFor={`task-${task.id}`}
                  className={`${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.title}
                </label>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {editingTaskId === task.id ? (
                <>
                  <Button variant="ghost" size="icon" onClick={saveEditedTask}>
                    Save
                  </Button>
                  <Button variant="ghost" size="icon" onClick={cancelEditing}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="icon" onClick={() => startEditingTask(task.id, task.title)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
