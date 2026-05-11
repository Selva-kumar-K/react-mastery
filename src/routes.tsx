import { createBrowserRouter } from "react-router-dom";
import ReactExample from "./Day0/ReactExample";
import Closure from "./Day1/Closure";
import NotificationBell from "./playground/ClosureExample2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ReactExample />,
  },
  {
    path: "/day-0",
    element: <ReactExample />,
  },
  // Add future days here:
  { path: "/day-1", element: <Closure /> },
  {
    path: "/playground",
    element: <NotificationBell />,
  },
]);

export default router;
