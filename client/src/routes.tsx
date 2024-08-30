import { createBrowserRouter } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import Register from "./components/Register";
import Login from "./components/Login";
import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute"; // Ensure this is imported

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <TaskManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "/register",  // Corrected the spelling
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
