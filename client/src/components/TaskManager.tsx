import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusIcon, TrashIcon, PencilIcon } from "lucide-react"

type Task = {
  id: number
  text: string
  completed: boolean
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editingTaskText, setEditingTaskText] = useState("")

  // Load tasks from local storage
  useEffect(() => {
    try {
      const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
      setTasks(savedTasks)
    } catch (error) {
      console.error("Failed to load tasks from local storage:", error)
    }
  }, [])

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    const saveTasks = () => {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks))
      } catch (error) {
        console.error("Failed to save tasks to local storage:", error)
      }
    }

    // Debounce saving to local storage to prevent excessive writes
    const timeoutId = setTimeout(saveTasks, 500)

    return () => clearTimeout(timeoutId)
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }])
      setNewTask("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const startEditingTask = (id: number, text: string) => {
    setEditingTaskId(id)
    setEditingTaskText(text)
  }

  const saveEditedTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTaskId !== null && editingTaskText.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTaskId ? { ...task, text: editingTaskText.trim() } : task
      ))
      setEditingTaskId(null)
      setEditingTaskText("")
    }
  }

  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingTaskText("")
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

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
        {filteredTasks.map(task => (
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
                  className={`${task.completed ? 'line-through text-gray-500' : ''}`}
                >
                  {task.text}
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
                  <Button variant="ghost" size="icon" onClick={() => startEditingTask(task.id, task.text)}>
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
  )
}
