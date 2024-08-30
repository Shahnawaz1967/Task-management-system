import { createBrowserRouter } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import Register from "./components/Register";
import Login from "./components/Login";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <TaskManager />,
          },
        ],
      },
      {
        path: "/register", // Corrected the spelling
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
