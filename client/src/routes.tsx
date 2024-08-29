import { createBrowserRouter } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import Registor from "./components/Registor";
import Login from "./components/Login";
import App from "./App";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <TaskManager />,
      },
      {
        path: "/registor",
        element: <Registor />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
export default router;
